-- Öğrenme yolları tablosuna eksik sütunları ekleyelim
ALTER TABLE learning_paths 
ADD COLUMN IF NOT EXISTS class_level VARCHAR(50) DEFAULT 'all',
ADD COLUMN IF NOT EXISTS required_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1;
