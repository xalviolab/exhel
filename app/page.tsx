// Update the landing page with new branding and color scheme
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { BookOpen, Activity, Award, Users, ArrowRight, CheckCircle, AlertTriangle, GraduationCap } from "lucide-react"
import { DisclaimerDialog } from "@/components/disclaimer-dialog"

// Sayfayı dinamik olarak işaretle
export const dynamic = "force-dynamic"

export default async function Home() {
  let session = null

  try {
    session = await getSession()
  } catch (error) {
    console.error("Session alınırken hata:", error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DisclaimerDialog />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">Edulogy</span>
            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold">
              <AlertTriangle className="h-3 w-3" />
              Beta Sürümü
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Özellikler
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary">
              Hakkında
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Fiyatlandırma
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/login">Giriş Yap</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Kayıt Ol</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Tıp Eğitiminde Yeni Nesil Öğrenme
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Healision bünyesinde sunulan interaktif öğrenme deneyimi ile bilginizi geliştirin. Eğlenceli
                    quizler, görsel içerikler ve gamification özellikleriyle öğrenmeyi keyifli hale getirin.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="px-8">
                    <Link href="/register">
                      Hemen Başla
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Daha Fazla Bilgi</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-2 opacity-10"></div>
                <div className="relative bg-white dark:bg-gray-950 border rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                      <span className="font-bold">Günlük Hedef</span>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      2/3 Tamamlandı
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Anatomiye Giriş</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ders tamamlandı</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Kalp Anatomisi</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ders tamamlandı</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-primary">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">İleti Sistemi</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Sonraki ders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full">Öğrenmeye Devam Et</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Özellikler</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Neden Edulogy?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Tıp eğitimini daha etkili ve eğlenceli hale getiren özelliklerle donatılmış platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Modüler Öğrenme</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tıp konularını küçük, sindirilebilir modüllere ayırarak adım adım öğrenin.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                  <Award className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Gamification</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Puanlar, rozetler ve günlük hedeflerle öğrenme motivasyonunuzu artırın.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">İnteraktif Quizler</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Bilginizi test edin ve anında geri bildirim alarak öğrenme sürecinizi pekiştirin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-navy-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Hakkında</div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tıp Eğitiminde Devrim</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Edulogy, Healision bünyesinde tıp öğrencileri ve sağlık profesyonelleri için tasarlanmış, modern
                    öğrenme teknikleriyle tıp eğitimini daha etkili hale getiren bir platformdur.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="/register">Hemen Başla</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-4">
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Tıp Öğrencileri İçin</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Tıp derslerinizi destekleyecek interaktif içerikler
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Pratik Yapın</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Vaka analizleri ve interaktif sorularla pratik yapma imkanı
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 lg:mt-8">
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Kapsamlı İçerik</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Temel tıp bilimlerinden klinik konulara kadar geniş içerik
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Sertifikalar</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Tamamladığınız modüller için sertifikalar kazanın
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Fiyatlandırma
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Planlar ve Fiyatlandırma</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  İhtiyaçlarınıza uygun planı seçin ve tıp eğitiminizi bir üst seviyeye taşıyın.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div>
                  <h3 className="text-xl font-bold">Ücretsiz</h3>
                  <div className="mt-4 text-3xl font-bold">₺0</div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Temel özelliklerle başlayın</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Temel modüllere erişim
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Günlük 5 kalp
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      İlerleme takibi
                    </li>
                  </ul>
                </div>
                <Button className="mt-6" variant="outline">
                  Ücretsiz Başla
                </Button>
              </div>
              <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 ring-2 ring-primary transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div>
                  <h3 className="text-xl font-bold">Premium</h3>
                  <div className="mt-4 text-3xl font-bold">
                    ₺49.99<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ay</span>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Daha fazla içerik ve özellik</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Tüm modüllere erişim
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Sınırsız kalp
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Detaylı istatistikler
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Özel rozetler
                    </li>
                  </ul>
                </div>
                <Button className="mt-6">Premium'a Yükselt</Button>
              </div>
              <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div>
                  <h3 className="text-xl font-bold">Kurumsal</h3>
                  <div className="mt-4 text-3xl font-bold">Özel Fiyat</div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Kurumunuza özel çözümler</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Tüm Premium özellikleri
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Özel içerik geliştirme
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Kurumsal yönetim paneli
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      7/24 destek
                    </li>
                  </ul>
                </div>
                <Button className="mt-6" variant="outline">
                  İletişime Geç
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-blue-50 dark:bg-navy-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">Edulogy</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Healision. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
