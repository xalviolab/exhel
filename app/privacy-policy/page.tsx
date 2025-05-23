import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Gizlilik Politikası - CardioEdu",
  description: "CardioEdu platformu gizlilik politikası",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight mb-6">Gizlilik Politikası</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="lead">
              Bu Gizlilik Politikası, CardioEdu platformunu kullanırken kişisel verilerinizin nasıl toplandığını,
              kullanıldığını ve korunduğunu açıklar.
            </p>

            <h2>1. Toplanan Bilgiler</h2>
            <p>CardioEdu olarak, aşağıdaki kişisel bilgileri toplayabiliriz:</p>
            <ul>
              <li>
                <strong>Hesap Bilgileri:</strong> Ad, soyad, e-posta adresi, şifre gibi kayıt sırasında sağladığınız
                bilgiler.
              </li>
              <li>
                <strong>Profil Bilgileri:</strong> Profil fotoğrafı, biyografi, eğitim geçmişi gibi isteğe bağlı olarak
                sağladığınız bilgiler.
              </li>
              <li>
                <strong>Kullanım Verileri:</strong> Platform üzerindeki etkinlikleriniz, tamamladığınız dersler, quiz
                sonuçları ve etkileşimleriniz.
              </li>
              <li>
                <strong>Cihaz Bilgileri:</strong> IP adresi, tarayıcı türü, cihaz türü, işletim sistemi ve diğer teknik
                bilgiler.
              </li>
              <li>
                <strong>Çerezler ve Benzer Teknolojiler:</strong> Platform'u kullanımınızı iyileştirmek için çerezler ve
                benzer teknolojiler kullanıyoruz.
              </li>
            </ul>

            <h2>2. Bilgilerin Kullanımı</h2>
            <p>Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
            <ul>
              <li>Platform'u sağlamak, yönetmek ve geliştirmek</li>
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>Kişiselleştirilmiş öğrenme deneyimi sunmak</li>
              <li>İlerlemenizi takip etmek ve başarılarınızı kaydetmek</li>
              <li>Teknik sorunları gidermek ve güvenliği sağlamak</li>
              <li>Sizinle iletişim kurmak ve güncellemeler sağlamak</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>

            <h2>3. Bilgilerin Paylaşımı</h2>
            <p>Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:</p>
            <ul>
              <li>
                <strong>Hizmet Sağlayıcılar:</strong> Platform'u işletmemize yardımcı olan güvenilir üçüncü taraf hizmet
                sağlayıcılarla.
              </li>
              <li>
                <strong>Yasal Gereklilikler:</strong> Yasal bir yükümlülüğe uymak, CardioEdu'nun haklarını veya
                güvenliğini korumak, yasadışı faaliyetleri önlemek veya soruşturmak için gerekli olduğunda.
              </li>
              <li>
                <strong>İş Transferleri:</strong> Bir birleşme, satın alma veya varlık satışı durumunda, kişisel
                bilgileriniz aktarılan varlıklar arasında olabilir.
              </li>
              <li>
                <strong>İzninizle:</strong> Açık izninizi aldığımız diğer durumlarda.
              </li>
            </ul>

            <h2>4. Veri Güvenliği</h2>
            <p>
              Kişisel bilgilerinizi korumak için uygun teknik ve organizasyonel önlemler alıyoruz. Ancak, internet
              üzerinden hiçbir veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını unutmayın.
            </p>

            <h2>5. Veri Saklama</h2>
            <p>
              Kişisel bilgilerinizi, hesabınız aktif olduğu sürece veya hizmetlerimizi sağlamak için gerekli olduğu
              sürece saklarız. Hesabınızı sildiğinizde, bilgilerinizi yasal yükümlülüklerimizi yerine getirmek,
              anlaşmazlıkları çözmek ve politikalarımızı uygulamak için gerekli olduğu sürece saklama hakkımızı saklı
              tutarız.
            </p>

            <h2>6. Çocukların Gizliliği</h2>
            <p>
              Platform, 13 yaşın altındaki çocuklar için tasarlanmamıştır. 13 yaşın altındaki bir çocuktan kişisel bilgi
              topladığımızı fark edersek, bu bilgileri en kısa sürede silmek için adımlar atarız.
            </p>

            <h2>7. Çerezler ve Benzer Teknolojiler</h2>
            <p>
              Platform'da çerezler ve benzer teknolojiler kullanıyoruz. Bu teknolojiler, Platform'u nasıl kullandığınızı
              anlamamıza ve deneyiminizi geliştirmemize yardımcı olur. Çoğu web tarayıcısı, çerezleri reddetmenize veya
              çerez alındığında sizi uyarmanıza olanak tanır, ancak bazı Platform özellikleri çerezler olmadan düzgün
              çalışmayabilir.
            </p>

            <h2>8. Haklarınız</h2>
            <p>Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinize erişim talep etme</li>
              <li>Yanlış veya eksik bilgilerin düzeltilmesini isteme</li>
              <li>Belirli koşullar altında kişisel verilerinizin silinmesini isteme</li>
              <li>Kişisel verilerinizin işlenmesine itiraz etme</li>
              <li>Verilerinizin taşınabilirliğini talep etme</li>
            </ul>
            <p>
              Bu haklarınızı kullanmak için{" "}
              <a href="mailto:privacy@cardioedu.com" className="text-primary hover:underline">
                privacy@cardioedu.com
              </a>{" "}
              adresinden bizimle iletişime geçebilirsiniz.
            </p>

            <h2>9. Değişiklikler</h2>
            <p>
              Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, Platform
              üzerinden veya e-posta yoluyla bildirimde bulunacağız.
            </p>

            <h2>10. İletişim</h2>
            <p>
              Bu Gizlilik Politikası ile ilgili sorularınız veya endişeleriniz varsa,{" "}
              <a href="mailto:privacy@cardioedu.com" className="text-primary hover:underline">
                privacy@cardioedu.com
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
