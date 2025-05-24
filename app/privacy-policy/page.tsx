import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-light/20 to-ivory">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-navy hover:bg-navy/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>

        <Card className="glass-card max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="corporate-gradient p-3 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-navy">Gizlilik Politikası</CardTitle>
            <p className="text-muted-foreground">Son güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">1. Giriş</h2>
                <p>
                  Edulogy olarak, Healision bünyesinde sunulan tıp eğitimi platformumuzda kullanıcılarımızın gizliliğini
                  korumayı taahhüt ediyoruz. Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığını,
                  kullanıldığını ve korunduğunu açıklamaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">2. Toplanan Bilgiler</h2>
                <h3 className="text-lg font-medium text-navy mb-2">2.1 Kişisel Bilgiler</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ad ve soyad</li>
                  <li>E-posta adresi</li>
                  <li>Eğitim durumu ve okul bilgileri</li>
                  <li>Profil fotoğrafı (isteğe bağlı)</li>
                </ul>

                <h3 className="text-lg font-medium text-navy mb-2 mt-4">2.2 Kullanım Verileri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ders tamamlama durumu</li>
                  <li>Quiz sonuçları ve performans verileri</li>
                  <li>Platform kullanım istatistikleri</li>
                  <li>Giriş ve çıkış zamanları</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">3. Bilgilerin Kullanımı</h2>
                <p>Toplanan bilgiler aşağıdaki amaçlarla kullanılır:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Eğitim hizmetlerinin sunulması</li>
                  <li>Kullanıcı deneyiminin kişiselleştirilmesi</li>
                  <li>İlerleme takibi ve raporlama</li>
                  <li>Teknik destek sağlanması</li>
                  <li>Platform güvenliğinin sağlanması</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">4. Bilgi Paylaşımı</h2>
                <p>
                  Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Eğitim kurumunuzla
                  ilerleme raporları paylaşılabilir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">5. Çerezler</h2>
                <p>
                  Platformumuz, kullanıcı deneyimini geliştirmek için çerezler kullanır. Çerez tercihlerinizi tarayıcı
                  ayarlarınızdan yönetebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">6. Veri Güvenliği</h2>
                <p>
                  Verileriniz endüstri standardı güvenlik önlemleriyle korunur. SSL şifreleme, güvenli sunucular ve
                  düzenli güvenlik denetimleri uygulanır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">7. Kullanıcı Hakları</h2>
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>Kişisel verilerinize erişim talep etme</li>
                  <li>Yanlış verilerin düzeltilmesini isteme</li>
                  <li>Verilerin silinmesini talep etme</li>
                  <li>Veri işlemeye itiraz etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">8. İletişim</h2>
                <p>
                  Gizlilik politikası ile ilgili sorularınız için{" "}
                  <a href="mailto:privacy@healision.com" className="text-navy hover:underline">
                    privacy@healision.com
                  </a>{" "}
                  adresinden bizimle iletişime geçebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">9. Değişiklikler</h2>
                <p>
                  Bu gizlilik politikası gerektiğinde güncellenebilir. Önemli değişiklikler kullanıcılara e-posta
                  yoluyla bildirilir.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
