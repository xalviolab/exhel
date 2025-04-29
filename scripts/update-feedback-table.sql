-- Feedback tablosuna feedback_type sütunu ekle
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS feedback_type VARCHAR(50);
