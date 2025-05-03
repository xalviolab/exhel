-- Ders erişim kontrolü için saklı prosedür
CREATE OR REPLACE FUNCTION check_lesson_access(p_user_id UUID, p_lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_lesson RECORD;
  v_user RECORD;
  v_previous_lesson RECORD;
  v_lesson_completed BOOLEAN;
  v_previous_lesson_completed BOOLEAN;
  v_lesson_index INTEGER;
  v_module_lessons RECORD[];
BEGIN
  -- Dersin bilgilerini al
  SELECT * INTO v_lesson FROM lessons WHERE id = p_lesson_id;
  IF NOT FOUND THEN
    RETURN TRUE; -- Ders bulunamadıysa kilitli olarak işaretle
  END IF;

  -- Kullanıcı bilgilerini al
  SELECT hearts INTO v_user FROM users WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN TRUE; -- Kullanıcı bulunamadıysa kilitli olarak işaretle
  END IF;

  -- Ders daha önce tamamlanmış mı kontrol et
  SELECT EXISTS (
    SELECT 1 FROM user_progress 
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id AND completed = TRUE
  ) INTO v_lesson_completed;
  
  -- Eğer ders tamamlanmışsa, her zaman erişime izin ver
  IF v_lesson_completed THEN
    RETURN FALSE;
  END IF;

  -- Kalp sayısı 0 ise ve ders tamamlanmamışsa erişimi engelle
  IF v_user.hearts <= 0 THEN
    RETURN TRUE;
  END IF;

  -- Modüldeki tüm dersleri al ve sırala
  WITH ordered_lessons AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY order_index) AS rn
    FROM lessons 
    WHERE module_id = v_lesson.module_id
    ORDER BY order_index
  )
  SELECT rn INTO v_lesson_index FROM ordered_lessons WHERE id = p_lesson_id;

  -- İlk ders her zaman açık
  IF v_lesson_index = 1 THEN
    RETURN FALSE;
  END IF;

  -- Önceki dersin ID'sini al
  SELECT id INTO v_previous_lesson 
  FROM lessons 
  WHERE module_id = v_lesson.module_id 
  ORDER BY order_index 
  OFFSET v_lesson_index - 2 
  LIMIT 1;

  -- Önceki dersin tamamlanıp tamamlanmadığını kontrol et
  SELECT EXISTS (
    SELECT 1 FROM user_progress 
    WHERE user_id = p_user_id AND lesson_id = v_previous_lesson.id AND completed = TRUE
  ) INTO v_previous_lesson_completed;

  -- Önceki ders tamamlanmamışsa kilitli
  RETURN NOT v_previous_lesson_completed;
END;
$$;

-- Quiz istatistiklerini güncellemek için saklı prosedür
CREATE OR REPLACE FUNCTION update_quiz_stats(
  p_user_id UUID,
  p_lesson_id UUID,
  p_score INTEGER,
  p_total_possible_score INTEGER,
  p_correct_answers INTEGER,
  p_total_questions INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_stats RECORD;
  v_success_rate NUMERIC;
BEGIN
  -- Quiz sonuçlarını kaydet
  INSERT INTO quiz_results (
    user_id,
    lesson_id,
    score,
    total_possible_score,
    correct_answers,
    total_questions,
    completed_at
  ) VALUES (
    p_user_id,
    p_lesson_id,
    p_score,
    p_total_possible_score,
    p_correct_answers,
    p_total_questions,
    NOW()
  );
  
  -- Başarı oranını hesapla
  v_success_rate := ROUND((p_correct_answers::NUMERIC / p_total_questions::NUMERIC) * 100);
  
  -- Başarı oranı %50'nin altındaysa dersi tamamlanmış olarak işaretleme
  IF v_success_rate < 50 THEN
    RETURN FALSE;
  END IF;
  
  -- Kullanıcının mevcut istatistiklerini kontrol et
  SELECT * INTO v_user_stats FROM user_stats WHERE user_id = p_user_id;

  IF FOUND THEN
    -- Mevcut istatistikleri güncelle
    UPDATE user_stats SET
      total_questions_answered = total_questions_answered + p_total_questions,
      correct_answers = correct_answers + p_correct_answers,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Yeni istatistik kaydı oluştur
    INSERT INTO user_stats (
      user_id,
      total_questions_answered,
      correct_answers,
      total_xp,
      total_lessons_completed,
      longest_streak,
      created_at,
      updated_at
    ) VALUES (
      p_user_id,
      p_total_questions,
      p_correct_answers,
      p_score,
      1,
      1,
      NOW(),
      NOW()
    );
  END IF;
  
  -- Başarılı tamamlama durumunda TRUE döndür
  RETURN TRUE;
END;
$$;

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
