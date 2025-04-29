-- Supabase Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('cardioedu', 'cardioedu', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket için basit politikalar oluştur
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES 
('Public Read Access', 'bucket_id = ''cardioedu''::text', 'cardioedu'),
('Auth Insert Access', '(bucket_id = ''cardioedu''::text) AND (auth.role() = ''authenticated''::text)', 'cardioedu'),
('Owner Update Access', '(bucket_id = ''cardioedu''::text) AND (auth.uid() = owner)', 'cardioedu'),
('Owner Delete Access', '(bucket_id = ''cardioedu''::text) AND (auth.uid() = owner)', 'cardioedu')
ON CONFLICT (name, bucket_id) DO NOTHING;
