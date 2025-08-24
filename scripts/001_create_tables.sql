-- Creating database schema for WhatsApp foguinho system

-- Tabela de grupos do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id VARCHAR(255) UNIQUE NOT NULL, -- ID do grupo no WhatsApp
    group_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Tabela de usuários participantes
CREATE TABLE IF NOT EXISTS group_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES whatsapp_groups(id) ON DELETE CASCADE,
    user_phone VARCHAR(20) NOT NULL, -- Número do WhatsApp
    user_name VARCHAR(255),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(group_id, user_phone)
);

-- Tabela principal do sistema de fogo
CREATE TABLE IF NOT EXISTS fire_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES whatsapp_groups(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    fire_level VARCHAR(20) DEFAULT 'normal', -- normal, blue, green, purple, etc.
    last_activity_date DATE DEFAULT CURRENT_DATE,
    users_active_today INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividade diária dos usuários
CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES whatsapp_groups(id) ON DELETE CASCADE,
    user_phone VARCHAR(20) NOT NULL,
    activity_date DATE DEFAULT CURRENT_DATE,
    message_count INTEGER DEFAULT 1,
    first_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_phone, activity_date)
);

-- Tabela de restaurações do fogo
CREATE TABLE IF NOT EXISTS fire_restorations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES whatsapp_groups(id) ON DELETE CASCADE,
    restored_by VARCHAR(20) NOT NULL, -- Número do usuário que restaurou
    restored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    previous_streak INTEGER DEFAULT 0,
    restoration_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_restorations_per_month', '5', 'Máximo de restaurações por mês por grupo'),
('min_users_per_day', '2', 'Mínimo de usuários que devem enviar mensagem por dia'),
('fire_levels', '["normal", "blue", "green", "purple", "gold", "diamond"]', 'Níveis do fogo em ordem crescente')
ON CONFLICT (setting_key) DO NOTHING;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fire_streaks_group_id ON fire_streaks(group_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_group_date ON daily_activities(group_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_fire_restorations_group_month ON fire_restorations(group_id, restoration_month);
CREATE INDEX IF NOT EXISTS idx_whatsapp_groups_group_id ON whatsapp_groups(group_id);
