-- Tabela de grupos do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id TEXT UNIQUE NOT NULL, -- ID do grupo no WhatsApp
  group_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários dos grupos
CREATE TABLE IF NOT EXISTS public.group_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE CASCADE,
  user_phone TEXT NOT NULL, -- Número do WhatsApp
  user_name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_phone)
);

-- Tabela de streaks (foguinho)
CREATE TABLE IF NOT EXISTS public.fire_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  fire_level TEXT DEFAULT 'laranja' CHECK (fire_level IN ('laranja', 'amarelo', 'azul', 'verde', 'roxo')),
  is_active BOOLEAN DEFAULT true,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades diárias
CREATE TABLE IF NOT EXISTS public.daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE CASCADE,
  activity_date DATE DEFAULT CURRENT_DATE,
  unique_users_count INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  users_list TEXT[], -- Array de telefones dos usuários ativos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, activity_date)
);

-- Tabela de restaurações
CREATE TABLE IF NOT EXISTS public.fire_restorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE CASCADE,
  restored_by TEXT NOT NULL, -- Telefone de quem restaurou
  restored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  month_year TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM') -- Para controlar limite mensal
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fire_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fire_restorations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acesso público para o webhook)
CREATE POLICY "Allow public access to whatsapp_groups" ON public.whatsapp_groups FOR ALL USING (true);
CREATE POLICY "Allow public access to group_users" ON public.group_users FOR ALL USING (true);
CREATE POLICY "Allow public access to fire_streaks" ON public.fire_streaks FOR ALL USING (true);
CREATE POLICY "Allow public access to daily_activities" ON public.daily_activities FOR ALL USING (true);
CREATE POLICY "Allow public access to fire_restorations" ON public.fire_restorations FOR ALL USING (true);
