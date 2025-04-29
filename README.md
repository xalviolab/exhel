# CardioEdu Projesi

## Vercel Deployment Kılavuzu

### Gerekli Çevre Değişkenleri

Projenin düzgün çalışması için Vercel'de aşağıdaki çevre değişkenlerini ayarlamanız gerekmektedir:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Çevre Değişkenlerini Ayarlama

1. Vercel dashboard'unuza gidin
2. Projenizi seçin
3. "Settings" sekmesine tıklayın
4. "Environment Variables" bölümüne gidin
5. Yukarıdaki değişkenleri ve değerlerini ekleyin
6. "Save" butonuna tıklayın
7. Projenizi yeniden deploy edin

### Dinamik Rota Sorunu Çözümü

Eğer şu hatayı alıyorsanız: "Route couldn't be rendered statically because it used `cookies`", aşağıdaki çözümleri uygulayabilirsiniz:

1. İlgili sayfayı client component'e dönüştürün (`"use client"` ekleyerek)
2. Veya sayfanın dinamik olarak oluşturulmasını zorlayın:

```javascript
// Sayfanın en üstüne ekleyin
export const dynamic = 'force-dynamic'
```

### Önemli Notlar

- Bu proje Next.js 13+ App Router kullanmaktadır
- Server ve Client Component'ler arasındaki farkları anlamak önemlidir
- Supabase bağlantı bilgilerinin eksik olması durumunda deploy başarısız olacaktır