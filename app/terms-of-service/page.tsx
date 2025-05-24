import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-navy">Kullanım Şartları</CardTitle>
            <p className="text-muted-foreground">Son güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">1. Kabul ve Onay</h2>
                <p>
                  Edulogy platformunu kullanarak, Healision tarafından sunulan bu kullanım şartlarını kabul etmiş
                  sayılırsınız. Bu şartları kabul etmiyorsanız, platformu kullanmamalısınız.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">2. Platform Tanımı</h2>
                <p>
                  Edulogy, Healision bünyesinde sunulan, tıp fakültesi öğrencileri için tasarlanmış interaktif eğitim
                  platformudur. Platform, çevrimiçi dersler, quizler ve eğitim materyalleri sunar.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">3. Kullanıcı Sorumlulukları</h2>
                <h3 className="text-lg font-medium text-navy mb-2">3.1 Hesap Güvenliği</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hesap bilgilerinizi güvenli tutmakla yükümlüsünüz</li>
                  <li>Şifrenizi başkalarıyla paylaşmamalısınız</li>
                  <li>Hesabınızda gerçekleşen tüm aktivitelerden sorumlusunuz</li>
                </ul>

                <h3 className="text-lg font-medium text-navy mb-2 mt-4">3.2 İçerik Kullanımı</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Eğitim materyalleri yalnızca kişisel kullanım içindir</li>
                  <li>İçerikleri izinsiz paylaşmak yasaktır</li>
                  <li>Ticari amaçlarla kullanım yasaktır</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">4. Yasak Davranışlar</h2>
                <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Platform güvenliğini tehdit edici faaliyetler</li>
                  <li>Başka kullanıcıların hesaplarına yetkisiz erişim</li>
                  <li>Zararlı yazılım yükleme veya dağıtma</li>
                  <li>Sahte bilgi paylaşımı</li>
                  <li>Telif hakkı ihlali</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">5. Fikri Mülkiyet</h2>
                <p>
                  Platform üzerindeki tüm içerikler (dersler, quizler, görseller, metinler) Healision'ın fikri
                  mülkiyetidir. Bu içeriklerin izinsiz kullanımı yasaktır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">6. Hizmet Kesintileri</h2>
                <p>
                  Healision, teknik bakım, güncelleme veya beklenmeyen durumlar nedeniyle hizmeti geçici olarak durdurma
                  hakkını saklı tutar.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">7. Hesap Sonlandırma</h2>
                <p>
                  Kullanım şartlarını ihlal eden hesaplar uyarı verilmeksizin sonlandırılabilir. Kullanıcılar
                  hesaplarını istediği zaman kapatabilir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">8. Sorumluluk Reddi</h2>
                <p>
                  Platform eğitim amaçlıdır ve tıbbi tavsiye niteliği taşımaz. Gerçek tıbbi durumlar için mutlaka uzman
                  hekime başvurun.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">9. Uygulanacak Hukuk</h2>
                <p>Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklar İstanbul mahkemelerinde çözülür.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">10. İletişim</h2>
                <p>
                  Kullanım şartları ile ilgili sorularınız için{" "}
                  <a href="mailto:legal@healision.com" className="text-navy hover:underline">
                    legal@healision.com
                  </a>{" "}
                  adresinden bizimle iletişime geçebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-navy mb-3">11. Değişiklikler</h2>
                <p>
                  Healision bu kullanım şartlarını istediği zaman değiştirme hakkını saklı tutar. Değişiklikler platform
                  üzerinden duyurulur.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
