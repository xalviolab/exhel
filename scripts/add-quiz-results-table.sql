-- Quiz sonuçları tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_possible_score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats tablosuna başarı oranı hesaplama fonksiyonu ekle
CREATE OR REPLACE FUNCTION get_user_success_rate(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_questions INTEGER;
  v_correct_answers INTEGER;
BEGIN
  -- Kullanıcının toplam soru ve doğru cevap sayılarını al
  SELECT 
    total_questions_answered, 
    correct_answers 
  INTO 
    v_total_questions, 
    v_correct_answers 
  FROM user_stats 
  WHERE user_id = p_user_id;

  -- Eğer hiç soru cevaplanmamışsa 0 döndür
  IF v_total_questions IS NULL OR v_total_questions = 0 THEN
    RETURN 0;
  END IF;

  -- Başarı oranını hesapla ve yüzde olarak döndür
  RETURN ROUND((v_correct_answers::NUMERIC / v_total_questions::NUMERIC) * 100);
END;
$$;

-- User stats tablosuna indeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_lesson_id ON quiz_results(lesson_id);
