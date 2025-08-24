-- Função para atualizar o nível do fogo baseado no streak
CREATE OR REPLACE FUNCTION update_fire_level(streak_count INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE 
    WHEN streak_count >= 100 THEN RETURN 'roxo';
    WHEN streak_count >= 50 THEN RETURN 'verde';
    WHEN streak_count >= 25 THEN RETURN 'azul';
    WHEN streak_count >= 10 THEN RETURN 'amarelo';
    ELSE RETURN 'laranja';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Função para processar atividade diária
CREATE OR REPLACE FUNCTION process_daily_activity(
  p_group_id UUID,
  p_user_phone TEXT,
  p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
DECLARE
  activity_record RECORD;
  current_users TEXT[];
  unique_count INTEGER;
BEGIN
  -- Buscar ou criar registro de atividade do dia
  SELECT * INTO activity_record 
  FROM public.daily_activities 
  WHERE group_id = p_group_id AND activity_date = p_activity_date;
  
  IF activity_record IS NULL THEN
    -- Criar novo registro
    INSERT INTO public.daily_activities (group_id, activity_date, unique_users_count, total_messages, users_list)
    VALUES (p_group_id, p_activity_date, 1, 1, ARRAY[p_user_phone]);
  ELSE
    -- Atualizar registro existente
    current_users := activity_record.users_list;
    
    -- Adicionar usuário se não estiver na lista
    IF NOT (p_user_phone = ANY(current_users)) THEN
      current_users := array_append(current_users, p_user_phone);
    END IF;
    
    unique_count := array_length(current_users, 1);
    
    UPDATE public.daily_activities 
    SET 
      unique_users_count = unique_count,
      total_messages = total_messages + 1,
      users_list = current_users
    WHERE group_id = p_group_id AND activity_date = p_activity_date;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar streak
CREATE OR REPLACE FUNCTION update_fire_streak(p_group_id UUID)
RETURNS VOID AS $$
DECLARE
  streak_record RECORD;
  yesterday_activity RECORD;
  today_activity RECORD;
  new_streak INTEGER;
  new_level TEXT;
BEGIN
  -- Buscar streak atual
  SELECT * INTO streak_record FROM public.fire_streaks WHERE group_id = p_group_id;
  
  -- Buscar atividade de ontem e hoje
  SELECT * INTO yesterday_activity 
  FROM public.daily_activities 
  WHERE group_id = p_group_id AND activity_date = CURRENT_DATE - INTERVAL '1 day';
  
  SELECT * INTO today_activity 
  FROM public.daily_activities 
  WHERE group_id = p_group_id AND activity_date = CURRENT_DATE;
  
  -- Verificar se o fogo deve continuar (pelo menos 2 usuários ativos hoje)
  IF today_activity IS NOT NULL AND today_activity.unique_users_count >= 2 THEN
    -- Fogo continua
    IF streak_record.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Streak continua
      new_streak := streak_record.current_streak + 1;
    ELSE
      -- Streak quebrou, mas recomença
      new_streak := 1;
    END IF;
    
    new_level := update_fire_level(new_streak);
    
    UPDATE public.fire_streaks 
    SET 
      current_streak = new_streak,
      max_streak = GREATEST(max_streak, new_streak),
      fire_level = new_level,
      is_active = true,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE group_id = p_group_id;
  ELSE
    -- Fogo apaga (menos de 2 usuários ativos)
    UPDATE public.fire_streaks 
    SET 
      is_active = false,
      updated_at = NOW()
    WHERE group_id = p_group_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
