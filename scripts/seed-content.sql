-- Kardiyoloji modülleri ekleme
INSERT INTO modules (id, title, description, image_url, order_index, required_level, is_premium)
VALUES 
  ('mod_basic', 'Temel Kardiyoloji', 'Kardiyoloji biliminin temel kavramları ve kalp anatomisi', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000', 0, 1, false),
  ('mod_ecg', 'EKG Okuma', 'Elektrokardiyografi temel prensipleri ve yorumlama teknikleri', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000', 1, 2, false),
  ('mod_arrhythmia', 'Aritmiler', 'Kalp ritim bozuklukları ve tedavi yaklaşımları', 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000', 2, 3, false),
  ('mod_coronary', 'Koroner Arter Hastalıkları', 'Koroner arter hastalıkları ve akut koroner sendromlar', 'https://images.unsplash.com/photo-1618939304347-e91db9e48d73?q=80&w=1000', 3, 4, true),
  ('mod_heart_failure', 'Kalp Yetmezliği', 'Kalp yetmezliği patofizyolojisi ve tedavi yaklaşımları', 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1000', 4, 5, true);

-- Temel Kardiyoloji modülü için dersler
INSERT INTO lessons (id, module_id, title, description, image_url, order_index, xp_reward, is_premium)
VALUES
  ('les_heart_anatomy', 'mod_basic', 'Kalp Anatomisi', 'Kalbin yapısı, odacıkları ve büyük damarlar', 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1000', 0, 10, false),
  ('les_cardiac_cycle', 'mod_basic', 'Kardiyak Siklus', 'Kalp döngüsü ve kalp sesleri', 'https://images.unsplash.com/photo-1618939304347-e91db9e48d73?q=80&w=1000', 1, 15, false),
  ('les_conduction', 'mod_basic', 'İleti Sistemi', 'Kalbin elektriksel ileti sistemi', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000', 2, 20, false);

-- EKG Okuma modülü için dersler
INSERT INTO lessons (id, module_id, title, description, image_url, order_index, xp_reward, is_premium)
VALUES
  ('les_ecg_basics', 'mod_ecg', 'EKG Temelleri', 'EKG kağıdı, derivasyonlar ve temel dalgalar', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000', 0, 15, false),
  ('les_ecg_rhythm', 'mod_ecg', 'Ritim Analizi', 'Normal sinüs ritmi ve ritim bozuklukları', 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000', 1, 20, false),
  ('les_ecg_axis', 'mod_ecg', 'Kalp Aksı', 'Kalp aksı hesaplama ve sapmaları', 'https://images.unsplash.com/photo-1618939304347-e91db9e48d73?q=80&w=1000', 2, 25, false);

-- Kalp Anatomisi dersi için sorular
INSERT INTO questions (id, lesson_id, question_text, question_type, image_url, order_index, xp_value)
VALUES
  ('q_anatomy_1', 'les_heart_anatomy', 'Kalbin en kalın duvarlı odacığı hangisidir?', 'multiple_choice', NULL, 0, 5),
  ('q_anatomy_2', 'les_heart_anatomy', 'Aşağıdakilerden hangisi kalbin sağ tarafında bulunur?', 'multiple_choice', NULL, 1, 5),
  ('q_anatomy_3', 'les_heart_anatomy', 'Mitral kapak hangi odacıklar arasında bulunur?', 'multiple_choice', NULL, 2, 5);

-- Kalp Anatomisi soruları için cevaplar
INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_anatomy_1', 'Sol ventrikül', true, 'Sol ventrikül, sistemik dolaşıma kan pompaladığı için en kalın duvarlı odacıktır.'),
  ('q_anatomy_1', 'Sağ ventrikül', false, 'Sağ ventrikül duvarı sol ventriküle göre daha incedir.'),
  ('q_anatomy_1', 'Sol atriyum', false, 'Atriyumların duvarları ventriküllere göre daha incedir.'),
  ('q_anatomy_1', 'Sağ atriyum', false, 'Atriyumların duvarları ventriküllere göre daha incedir.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_anatomy_2', 'Pulmoner arter', true, 'Pulmoner arter sağ ventrikülden çıkar ve akciğerlere kan taşır.'),
  ('q_anatomy_2', 'Aort', false, 'Aort sol ventrikülden çıkar.'),
  ('q_anatomy_2', 'Pulmoner venler', false, 'Pulmoner venler sol atriyuma açılır.'),
  ('q_anatomy_2', 'Sol ventrikül', false, 'Sol ventrikül kalbin sol tarafında bulunur.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_anatomy_3', 'Sol atriyum ve sol ventrikül', true, 'Mitral kapak sol atriyum ile sol ventrikül arasında bulunur.'),
  ('q_anatomy_3', 'Sağ atriyum ve sağ ventrikül', false, 'Sağ atriyum ve sağ ventrikül arasında triküspit kapak bulunur.'),
  ('q_anatomy_3', 'Sol ventrikül ve aort', false, 'Sol ventrikül ve aort arasında aort kapağı bulunur.'),
  ('q_anatomy_3', 'Sağ ventrikül ve pulmoner arter', false, 'Sağ ventrikül ve pulmoner arter arasında pulmoner kapak bulunur.');

-- Kardiyak Siklus dersi için sorular
INSERT INTO questions (id, lesson_id, question_text, question_type, image_url, order_index, xp_value)
VALUES
  ('q_cycle_1', 'les_cardiac_cycle', 'Kalp döngüsünde ventriküler sistol sırasında hangi kapaklar açıktır?', 'multiple_choice', NULL, 0, 5),
  ('q_cycle_2', 'les_cardiac_cycle', 'S1 kalp sesi ne zaman duyulur?', 'multiple_choice', NULL, 1, 5),
  ('q_cycle_3', 'les_cardiac_cycle', 'Diyastol sırasında kalp odacıklarında ne olur?', 'multiple_choice', NULL, 2, 5);

-- Kardiyak Siklus soruları için cevaplar
INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_cycle_1', 'Aort ve pulmoner kapaklar', true, 'Ventriküler sistol sırasında atriyoventriküler kapaklar (mitral ve triküspit) kapanır, semilunar kapaklar (aort ve pulmoner) açılır.'),
  ('q_cycle_1', 'Mitral ve triküspit kapaklar', false, 'Mitral ve triküspit kapaklar ventriküler sistol sırasında kapanır.'),
  ('q_cycle_1', 'Tüm kapaklar', false, 'Kalp döngüsünün hiçbir aşamasında tüm kapaklar aynı anda açık olmaz.'),
  ('q_cycle_1', 'Hiçbir kapak', false, 'Ventriküler sistol sırasında semilunar kapaklar açıktır.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_cycle_2', 'Atriyoventriküler kapakların kapanması sırasında', true, 'S1 kalp sesi, mitral ve triküspit kapakların kapanması sırasında duyulur.'),
  ('q_cycle_2', 'Semilunar kapakların kapanması sırasında', false, 'Semilunar kapakların kapanması S2 kalp sesini oluşturur.'),
  ('q_cycle_2', 'Atriyoventriküler kapakların açılması sırasında', false, 'Atriyoventriküler kapakların açılması belirgin bir ses oluşturmaz.'),
  ('q_cycle_2', 'Semilunar kapakların açılması sırasında', false, 'Semilunar kapakların açılması belirgin bir ses oluşturmaz.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_cycle_3', 'Kalp odacıkları kanla dolar', true, 'Diyastol, kalbin gevşeme ve dolum fazıdır.'),
  ('q_cycle_3', 'Kalp odacıkları kasılır', false, 'Kasılma sistol fazında gerçekleşir.'),
  ('q_cycle_3', 'Kalp odacıkları boşalır', false, 'Boşalma sistol fazında gerçekleşir.'),
  ('q_cycle_3', 'Kalp odacıkları tamamen kapanır', false, 'Kalp odacıkları kapanmaz, sadece genişler ve daralır.');

-- İleti Sistemi dersi için sorular
INSERT INTO questions (id, lesson_id, question_text, question_type, image_url, order_index, xp_value)
VALUES
  ('q_conduction_1', 'les_conduction', 'Kalbin doğal pacemaker\'ı hangisidir?', 'multiple_choice', NULL, 0, 5),
  ('q_conduction_2', 'les_conduction', 'Aşağıdakilerden hangisi kalbin ileti sisteminin bir parçası değildir?', 'multiple_choice', NULL, 1, 5),
  ('q_conduction_3', 'les_conduction', 'Purkinje lifleri nerede bulunur?', 'multiple_choice', NULL, 2, 5);

-- İleti Sistemi soruları için cevaplar
INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_conduction_1', 'Sinoatriyal (SA) düğüm', true, 'SA düğüm, kalbin doğal pacemaker\'ıdır ve normal kalp ritmini başlatır.'),
  ('q_conduction_1', 'Atriyoventriküler (AV) düğüm', false, 'AV düğüm, SA düğümden gelen uyarıları ventriküllere iletir.'),
  ('q_conduction_1', 'His demeti', false, 'His demeti, AV düğümden gelen uyarıları ventriküllere iletir.'),
  ('q_conduction_1', 'Purkinje lifleri', false, 'Purkinje lifleri, uyarıları ventrikül miyokardına iletir.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_conduction_2', 'Papiller kaslar', true, 'Papiller kaslar ileti sisteminin bir parçası değil, kapak fonksiyonunda rol alan yapılardır.'),
  ('q_conduction_2', 'Sinoatriyal düğüm', false, 'SA düğüm ileti sisteminin bir parçasıdır.'),
  ('q_conduction_2', 'Atriyoventriküler düğüm', false, 'AV düğüm ileti sisteminin bir parçasıdır.'),
  ('q_conduction_2', 'His demeti', false, 'His demeti ileti sisteminin bir parçasıdır.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_conduction_3', 'Ventrikül duvarlarında', true, 'Purkinje lifleri ventrikül duvarlarında bulunur ve uyarıyı miyokarda iletir.'),
  ('q_conduction_3', 'Atriyum duvarlarında', false, 'Purkinje lifleri atriyumlarda bulunmaz.'),
  ('q_conduction_3', 'Sinoatriyal düğümde', false, 'Purkinje lifleri SA düğümde bulunmaz.'),
  ('q_conduction_3', 'Atriyoventriküler düğümde', false, 'Purkinje lifleri AV düğümde bulunmaz.');

-- EKG Temelleri dersi için sorular
INSERT INTO questions (id, lesson_id, question_text, question_type, image_url, order_index, xp_value)
VALUES
  ('q_ecg_basics_1', 'les_ecg_basics', 'Standart EKG kağıdında küçük kareler kaç mm x kaç mm boyutundadır?', 'multiple_choice', NULL, 0, 5),
  ('q_ecg_basics_2', 'les_ecg_basics', 'EKG\'de P dalgası neyi temsil eder?', 'multiple_choice', NULL, 1, 5),
  ('q_ecg_basics_3', 'les_ecg_basics', 'Standart EKG\'de kağıt hızı kaç mm/sn\'dir?', 'multiple_choice', NULL, 2, 5);

-- EKG Temelleri soruları için cevaplar
INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_ecg_basics_1', '1 mm x 1 mm', true, 'Standart EKG kağıdında küçük kareler 1 mm x 1 mm boyutundadır.'),
  ('q_ecg_basics_1', '5 mm x 5 mm', false, 'Bu büyük karelerin boyutudur.'),
  ('q_ecg_basics_1', '2 mm x 2 mm', false, 'Standart EKG kağıdında böyle bir kare boyutu yoktur.'),
  ('q_ecg_basics_1', '0.5 mm x 0.5 mm', false, 'Standart EKG kağıdında böyle bir kare boyutu yoktur.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_ecg_basics_2', 'Atriyal depolarizasyon', true, 'P dalgası atriyal depolarizasyonu temsil eder.'),
  ('q_ecg_basics_2', 'Ventriküler depolarizasyon', false, 'Ventriküler depolarizasyon QRS kompleksi ile temsil edilir.'),
  ('q_ecg_basics_2', 'Atriyal repolarizasyon', false, 'Atriyal repolarizasyon genellikle QRS kompleksi içinde gizlenir.'),
  ('q_ecg_basics_2', 'Ventriküler repolarizasyon', false, 'Ventriküler repolarizasyon T dalgası ile temsil edilir.');

INSERT INTO answers (question_id, answer_text, is_correct, explanation)
VALUES
  ('q_ecg_basics_3', '25 mm/sn', true, 'Standart EKG\'de kağıt hızı 25 mm/sn\'dir.'),
  ('q_ecg_basics_3', '50 mm/sn', false, 'Bu hız bazen özel durumlarda kullanılır, ancak standart değildir.'),
  ('q_ecg_basics_3', '10 mm/sn', false, 'Bu hız standart değildir.'),
  ('q_ecg_basics_3', '100 mm/sn', false, 'Bu hız standart değildir.');

-- Rozetler ekleme
INSERT INTO badges (id, name, description, image_url, requirement_type, requirement_value)
VALUES
  ('badge_streak_3', '3 Gün Seri', '3 gün üst üste çalışma', 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png', 'streak', 3),
  ('badge_streak_7', '7 Gün Seri', '7 gün üst üste çalışma', 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', 'streak', 7),
  ('badge_streak_30', '30 Gün Seri', '30 gün üst üste çalışma', 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', 'streak', 30),
  ('badge_lessons_5', 'Çırak', '5 ders tamamlama', 'https://cdn-icons-png.flaticon.com/512/2583/2583281.png', 'lessons_completed', 5),
  ('badge_lessons_20', 'Uzman', '20 ders tamamlama', 'https://cdn-icons-png.flaticon.com/512/2583/2583  5),
  ('badge_lessons_20', 'Uzman', '20 ders tamamlama', 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', 'lessons_completed', 20),
  ('badge_lessons_50', 'Usta', '50 ders tamamlama', 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', 'lessons_completed', 50),
  ('badge_xp_100', 'Başlangıç', '100 XP kazanma', 'https://cdn-icons-png.flaticon.com/512/2583/2583270.png', 'xp_earned', 100),
  ('badge_xp_500', 'İlerleyen', '500 XP kazanma', 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', 'xp_earned', 500),
  ('badge_xp_1000', 'Üstün Başarı', '1000 XP kazanma', 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', 'xp_earned', 1000),
  ('badge_level_5', 'Seviye 5', 'Seviye 5\'e ulaşma', 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png', 'level', 5),
  ('badge_level_10', 'Seviye 10', 'Seviye 10\'a ulaşma', 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', 'level', 10),
  ('badge_level_20', 'Seviye 20', 'Seviye 20\'ye ulaşma', 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', 'level', 20);
