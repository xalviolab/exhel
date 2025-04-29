-- Öğrenme yolları tablosu
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  required_level INTEGER DEFAULT 1,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenme yolu modülleri tablosu
CREATE TABLE IF NOT EXISTS learning_path_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_path_id, module_id)
);

-- Kullanıcı öğrenme yolları tablosu
CREATE TABLE IF NOT EXISTS user_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  progress_percentage FLOAT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, learning_path_id)
);

-- Kullanıcı öğrenme analitiği tablosu
CREATE TABLE IF NOT EXISTS user_learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  time_spent INTEGER DEFAULT 0, -- saniye cinsinden
  attempts INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Öğrenme zorluk seviyeleri tablosu
CREATE TABLE IF NOT EXISTS difficulty_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  multiplier FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı zorluk seviyesi tercihleri
CREATE TABLE IF NOT EXISTS user_difficulty_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  difficulty_level_id UUID NOT NULL REFERENCES difficulty_levels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Öğrenme önerileri tablosu
CREATE TABLE IF NOT EXISTS learning_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL, -- 'module', 'lesson', 'learning_path'
  priority INTEGER DEFAULT 0,
  reason TEXT,
  viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Başlangıç zorluk seviyelerini ekle
INSERT INTO difficulty_levels (name, description, multiplier)
VALUES 
('Kolay', 'Yeni başlayanlar için temel seviye', 0.8),
('Normal', 'Standart zorluk seviyesi', 1.0),
('Zor', 'İleri düzey kullanıcılar için zorlayıcı içerik', 1.2),
('Uzman', 'Profesyoneller için en zorlu içerik', 1.5);
