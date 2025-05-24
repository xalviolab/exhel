# CardioEdu Platform Geliştirme Önerisi

## Öğrenme Yolları (Learning Paths) Özelliği

Kardiyoloji eğitim platformunu geliştirmek için "Öğrenme Yolları" (Learning Paths) özelliğinin eklenmesini öneriyorum. Bu özellik, kullanıcıların belirli kardiyoloji alanlarında sistematik ilerleme kaydetmelerini sağlayacaktır.

### Özellik Detayları

1. **Özelleştirilmiş Öğrenme Yolları**
   - Temel Kardiyoloji Yolu
   - İleri EKG Yorumlama Yolu
   - Kardiyak Görüntüleme Yolu
   - Klinik Vaka Çalışmaları Yolu
   - Kardiyak Aciller Yolu

2. **Yol Yapısı**
   - Her yol, birbiriyle ilişkili modüllerden oluşur
   - Modüller arasında zorunlu sıralama ve bağımlılıklar tanımlanabilir
   - Her yolun başında bir ön değerlendirme sınavı bulunur
   - Her yolun sonunda bir sertifika sınavı bulunur

3. **İlerleme Takibi**
   - Kullanıcılar her yol için ilerleme yüzdesini görebilir
   - Yol haritası görsel olarak sunulur (tamamlanan ve kilitli modüller)
   - Yol tamamlandığında dijital sertifika verilir

4. **Gamifikasyon Elementleri**
   - Yol üzerindeki ara hedeflere ulaşıldığında özel rozetler kazanılır
   - Yolları tamamlama hızına göre ekstra XP bonusları
   - Yol lider tabloları (en hızlı tamamlayanlar, en yüksek puanla tamamlayanlar)

### Veritabanı Yapısı

\`\`\`sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  difficulty_level INTEGER NOT NULL DEFAULT 1,
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE path_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(path_id, module_id)
);

CREATE TABLE user_path_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_percentage INTEGER DEFAULT 0,
  is_certified BOOLEAN DEFAULT FALSE,
  certification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);
\`\`\`

### Kullanıcı Arayüzü

1. **Öğrenme Yolları Sayfası**
   - Tüm mevcut yolların listesi ve açıklamaları
   - Her yol için zorluk seviyesi, tahmini tamamlama süresi ve içerdiği modül sayısı
   - Kullanıcının başladığı yollar için ilerleme durumu

2. **Yol Detay Sayfası**
   - Yol haritası görselleştirmesi
   - Modül listesi ve bağımlılıkları
   - İlerleme istatistikleri
   - Kazanılabilecek rozetler

3. **Profil Sayfası Entegrasyonu**
   - Kullanıcının aktif olarak çalıştığı yollar
   - Tamamlanan yollar ve sertifikalar
   - Yol bazlı başarı istatistikleri

### Faydaları

1. **Yapılandırılmış Öğrenme**
   - Kullanıcılar için net bir öğrenme rotası sağlar
   - Bilgi birikiminin sistematik olarak inşa edilmesini sağlar

2. **Motivasyon Artışı**
   - Belirli hedeflere yönelik çalışma motivasyonu sağlar
   - Sertifikalar ve rozetler ile başarı hissi güçlendirilir

3. **Kişiselleştirme**
   - Kullanıcılar ilgi alanlarına göre yol seçebilir
   - Farklı zorluk seviyelerinde yollar sunulabilir

4. **Platform Bağlılığı**
   - Uzun vadeli platform kullanımını teşvik eder
   - Kullanıcı katılımını ve etkileşimini artırır

Bu özellik, CardioEdu platformunu daha kapsamlı ve yapılandırılmış bir öğrenme deneyimine dönüştürecek, kullanıcı memnuniyetini ve öğrenme etkinliğini artıracaktır.

# Rozet Bilgilendirmesi
Küçük Boyutlar (İsim Yanı, Liste Görünümü):

24x24 piksel
32x32 piksel
40x40 piksel
(Bunlar, kullanıcı adı yanında veya bir başarı listesinde ikon gibi görünen küçük rozetler için idealdir.)
Orta Boyutlar (Profil Sayfası, Başarı Galerisi):

48x48 piksel
64x64 piksel
80x80 piksel
(Kullanıcının profilinde veya kazandığı tüm başarıların listelendiği bir galeride daha belirgin görünen rozetler için uygundur.)
Büyük Boyutlar (Pop-up Bildirim, Başarı Kazanma Ekranı):

100x100 piksel
128x128 piksel
(Kullanıcı yeni bir rozet kazandığında çıkan tebrik pop-up'ları veya özel başarı sayfaları için daha büyük ve detaylı görünen rozetler.)
Önemli Not: SVG kullandığınız için rozeti tek bir vector dosya olarak tasarlarsınız. Web sitenizin kodunda (HTML/CSS) bu SVG'nin görüntüleneceği boyutu (örneğin width="48" height="48" veya style="width: 64px; height: 64px;") belirtirsiniz. SVG dosyası, belirttiğiniz boyuta otomatik ve net bir şekilde ölçeklenir.

Tavsiye: Farklı kullanım alanları için yukarıdaki boyut aralıklarından birkaçını belirleyin. Rozetlerinizi tasarlarken, en küçük boyutta bile temel şeklinin ve ikonun anlaşılır olmasına dikkat edin. Platformunuzda farklı ekran boyutlarında (mobil, tablet, masaüstü) bu boyutları test ederek en iyi görünen ve arayüzünüzle en uyumlu olanları seçin.
