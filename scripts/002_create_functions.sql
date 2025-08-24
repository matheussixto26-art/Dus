-- Creating utility functions for fire system

-- Função para calcular o nível do fogo baseado no streak
CREATE OR REPLACE FUNCTION calculate_fire_level(streak_count INTEGER)
RETURNS VARCHAR(20) AS $$
BEGIN
    CASE 
        WHEN streak_count >= 100 THEN RETURN 'diamond';
        WHEN streak_count >= 50 THEN RETURN 'gold';
        WHEN streak_count >= 30 THEN RETURN 'purple';
        WHEN streak_count >= 15 THEN RETURN 'green';
        WHEN streak_count >= 7 THEN RETURN 'blue';
        ELSE RETURN 'normal';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se o fogo deve ser mantido
CREATE OR REPLACE FUNCTION check_fire_status(p_group_id UUID, check_date DATE DEFAULT CURRENT_DATE)
RETURNS BOOLEAN AS $$
DECLARE
    active_users_count INTEGER;
    min_users_required INTEGER;
BEGIN
    -- Buscar configuração de usuários mínimos
    SELECT CAST(setting_value AS INTEGER) INTO min_users_required
    FROM system_settings 
    WHERE setting_key = 'min_users_per_day';
    
    -- Contar usuários ativos no dia
    SELECT COUNT(DISTINCT user_phone) INTO active_users_count
    FROM daily_activities 
    WHERE group_id = p_group_id 
    AND activity_date = check_date;
    
    RETURN active_users_count >= min_users_required;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar streak do grupo
CREATE OR REPLACE FUNCTION update_group_streak(p_group_id UUID)
RETURNS VOID AS $$
DECLARE
    fire_maintained BOOLEAN;
    current_streak_val INTEGER;
    new_level VARCHAR(20);
BEGIN
    -- Verificar se o fogo foi mantido ontem
    fire_maintained := check_fire_status(p_group_id, CURRENT_DATE - INTERVAL '1 day');
    
    IF fire_maintained THEN
        -- Incrementar streak
        UPDATE fire_streaks 
        SET current_streak = current_streak + 1,
            max_streak = GREATEST(max_streak, current_streak + 1),
            updated_at = NOW()
        WHERE group_id = p_group_id
        RETURNING current_streak INTO current_streak_val;
        
        -- Calcular novo nível
        new_level := calculate_fire_level(current_streak_val);
        
        -- Atualizar nível
        UPDATE fire_streaks 
        SET fire_level = new_level
        WHERE group_id = p_group_id;
    ELSE
        -- Resetar streak se não foi mantido
        UPDATE fire_streaks 
        SET current_streak = 0,
            fire_level = 'normal',
            updated_at = NOW()
        WHERE group_id = p_group_id;
    END IF;
    
    -- Atualizar data da última atividade e resetar contador diário
    UPDATE fire_streaks 
    SET last_activity_date = CURRENT_DATE,
        users_active_today = 0
    WHERE group_id = p_group_id;
END;
$$ LANGUAGE plpgsql;
