CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  satisfaction_level TEXT NOT NULL,
  feedback_type TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikalarını ayarla
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Kullanıcıların kendi geri bildirimlerini görmesine izin ver
CREATE POLICY "Users can view their own feedback" 
  ON feedback FOR SELECT 
  USING (auth.uid() = user_id);

-- Kullanıcıların geri bildirim eklemesine izin ver
CREATE POLICY "Users can insert their own feedback" 
  ON feedback FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Adminlerin tüm geri bildirimleri görmesine izin ver
CREATE POLICY "Admins can view all feedback" 
  ON feedback FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Adminlerin tüm geri bildirimleri güncellemesine izin ver
CREATE POLICY "Admins can update all feedback" 
  ON feedback FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
