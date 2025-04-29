-- Feedback tablosuna status sütunu ekle
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
