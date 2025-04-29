-- Öğrenme yolları tablosu
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_level TEXT,
  difficulty_level INTEGER,
  color_theme TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenme yolu modülleri tablosu
CREATE TABLE IF NOT EXISTS learning_path_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_path_id, module_id)
);

-- Kullanıcı öğrenme yolları tablosu
CREATE TABLE IF NOT EXISTS user_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  progress_percentage FLOAT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, learning_path_id)
);

-- Rozetler tablosu
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Örnek öğrenme yolları ekleyelim
INSERT INTO learning_paths (title, description, class_level, difficulty_level, color_theme, is_premium)
VALUES 
('Temel Kardiyoloji', 'Kardiyoloji alanında temel bilgileri öğrenin', 'all', 1, 'red', false),
('EKG Yorumlama', 'EKG okuma ve yorumlama becerilerinizi geliştirin', 'medical', 2, 'blue', false),
('Kardiyak Görüntüleme', 'Ekokardiyografi ve diğer görüntüleme tekniklerini öğrenin', 'medical', 3, 'purple', true),
('Klinik Vaka Çalışmaları', 'Gerçek klinik vakalar üzerinden kardiyoloji pratiği yapın', 'medical', 2, 'green', false),
('Kardiyak Aciller', 'Acil kardiyolojik durumları tanıma ve müdahale etme', 'medical', 3, 'amber', true);
