-- Dersler tablosuna içerik alanı ekleyelim
ALTER TABLE lessons ADD COLUMN content TEXT;

-- Ders bölümleri için yeni bir tablo oluşturalım
CREATE TABLE IF NOT EXISTS lesson_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ders kaynakları için yeni bir tablo oluşturalım
CREATE TABLE IF NOT EXISTS lesson_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'link', 'file', 'video', etc.
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ders görselleri için yeni bir tablo oluşturalım
CREATE TABLE IF NOT EXISTS lesson_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
