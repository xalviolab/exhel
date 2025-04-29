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

-- Örnek rozetler ekleyelim
INSERT INTO badges (name, description, image_url, learning_path_id)
SELECT 
  'Kardiyoloji Başlangıç', 
  'Temel kardiyoloji bilgilerini tamamladınız', 
  '/placeholder.svg?height=100&width=100',
  id
FROM learning_paths
WHERE title = 'Temel Kardiyoloji'
LIMIT 1;

INSERT INTO badges (name, description, image_url, learning_path_id)
SELECT 
  'EKG Uzmanı', 
  'EKG yorumlama becerilerinizi geliştirdiniz', 
  '/placeholder.svg?height=100&width=100',
  id
FROM learning_paths
WHERE title = 'EKG Yorumlama'
LIMIT 1;
