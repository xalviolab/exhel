import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Kullanım Şartları - Edulogy",
  description: "Edulogy platformu kullanım şartları ve koşulları",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Kullanım Şartları</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="lead">
              Bu Kullanım Şartları, Edulogy platformunu kullanımınızı düzenleyen koşulları içerir. Platformumuzu
              kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>

            <h2>1. Tanımlar</h2>
            <p>
              <strong>"Platform"</strong> ifadesi, Edulogy web sitesini, mobil uygulamasını ve ilgili tüm dijital
              hizmetleri kapsar.
              <br />
              <strong>"Kullanıcı"</strong> ifadesi, platformu kullanan herhangi bir kişiyi ifade eder.
              <br />
              <strong>"İçerik"</strong> ifadesi, platform üzerinde bulunan tüm metin, görsel, video, ses ve diğer
              materyalleri kapsar.
            </p>

            <h2>2. Hesap Oluşturma ve Güvenlik</h2>
            <p>
              Platform'u kullanmak için bir hesap oluşturmanız gerekebilir. Hesap bilgilerinizin gizliliğini korumak ve
              hesabınızla gerçekleştirilen tüm etkinliklerden sorumlu olmak sizin sorumluluğunuzdadır.
            </p>
            <p>
              Hesap oluştururken doğru ve güncel bilgiler sağlamakla yükümlüsünüz. 13 yaşından küçükseniz, Platform'u
              kullanamazsınız.
            </p>

            <h2>3. Kullanım Koşulları</h2>
            <p>Platform'u kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
            <ul>
              <li>Platform'u yasa dışı amaçlarla kullanmamak</li>
              <li>Platform'un güvenliğini tehlikeye atacak faaliyetlerde bulunmamak</li>
              <li>Diğer kullanıcıların Platform'u kullanmasını engelleyecek davranışlarda bulunmamak</li>
              <li>Platform üzerinden zararlı yazılım yaymamak</li>
              <li>İzinsiz reklam veya promosyon materyali dağıtmamak</li>
            </ul>

            <h2>4. İçerik ve Fikri Mülkiyet</h2>
            <p>
              Platform üzerindeki tüm içerik, aksi belirtilmedikçe Edulogy'nin veya lisans verenlerin mülkiyetindedir
              ve telif hakkı, ticari marka ve diğer fikri mülkiyet yasaları tarafından korunmaktadır.
            </p>
            <p>
              Platform'a yüklediğiniz içerikler için, bu içerikleri kullanma, düzenleme, paylaşma ve dağıtma hakkını
              Edulogy'ye vermiş olursunuz.
            </p>

            <h2>5. Sorumluluk Reddi</h2>
            <p>
              Platform "olduğu gibi" ve "mevcut olduğu şekliyle" sunulmaktadır. Edulogy, Platform'un kesintisiz veya
              hatasız çalışacağını garanti etmez.
            </p>
            <p>
              <strong>Önemli Uyarı:</strong> Platform üzerindeki tıbbi içerikler yalnızca eğitim amaçlıdır ve
              profesyonel tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlık sorunlarınız için her zaman nitelikli
              bir sağlık uzmanına başvurunuz.
            </p>

            <h2>6. Sorumluluk Sınırlaması</h2>
            <p>
              Edulogy, Platform'un kullanımından kaynaklanan doğrudan, dolaylı, arızi, özel veya sonuç olarak ortaya
              çıkan zararlardan sorumlu tutulamaz.
            </p>

            <h2>7. Değişiklikler</h2>
            <p>
              Edulogy, bu Kullanım Şartları'nı herhangi bir zamanda değiştirme hakkını saklı tutar. Değişiklikler,
              Platform üzerinde yayınlandıktan sonra geçerli olacaktır.
            </p>

            <h2>8. Fesih</h2>
            <p>
              Edulogy, kendi takdirine bağlı olarak, herhangi bir zamanda ve herhangi bir nedenle, önceden bildirimde
              bulunmaksızın hesabınızı askıya alabilir veya sonlandırabilir.
            </p>

            <h2>9. Uygulanacak Hukuk</h2>
            <p>Bu Kullanım Şartları, Türkiye Cumhuriyeti yasalarına tabidir ve bu yasalara göre yorumlanacaktır.</p>

            <h2>10. İletişim</h2>
            <p>
              Bu Kullanım Şartları ile ilgili sorularınız için{" "}
              <a href="mailto:info@edulogy.com" className="text-primary hover:underline">
                info@edulogy.com
              </a>{" "}
              adresinden bizimle iletişime geçebilirsiniz.
            </p>

            <p className="text-sm text-muted-foreground mt-8">Son güncelleme tarihi: 23 Mayıs 2023</p>
          </div>
        </div>
      </main>
    </div>
  )
}
