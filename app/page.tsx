import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, Award, BookOpen, ArrowRight, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "İnteraktif Dersler",
      description: "Modern öğrenme metodları ile tasarlanmış kapsamlı tıp dersleri",
    },
    {
      icon: Users,
      title: "Uzman Eğitmenler",
      description: "Alanında uzman hekimler tarafından hazırlanan içerikler",
    },
    {
      icon: Award,
      title: "Sertifika Programları",
      description: "Tamamladığınız eğitimler için geçerli sertifikalar",
    },
    {
      icon: Zap,
      title: "Hızlı Öğrenme",
      description: "Kişiselleştirilmiş öğrenme deneyimi ile hızlı ilerleme",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Aktif Öğrenci" },
    { number: "500+", label: "Ders İçeriği" },
    { number: "50+", label: "Uzman Eğitmen" },
    { number: "98%", label: "Memnuniyet Oranı" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-light/20 to-ivory">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="corporate-gradient p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">Edulogy</h1>
                <p className="text-xs text-muted-foreground">by Healision</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-navy hover:text-navy-light transition-colors">
                Özellikler
              </Link>
              <Link href="#about" className="text-navy hover:text-navy-light transition-colors">
                Hakkımızda
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button className="corporate-button">Kayıt Ol</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-navy/10 text-navy border-navy/20">
            Türkiye'nin En Kapsamlı Tıp Eğitimi Platformu
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-navy mb-6 leading-tight">
            Tıp Eğitiminde
            <br />
            <span className="bg-gradient-to-r from-navy to-navy-light bg-clip-text text-transparent">Yeni Dönem</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Healision bünyesinde sunulan Edulogy ile tıp fakültesi öğrencileri için tasarlanmış interaktif eğitim
            deneyimi. Modern teknoloji ile öğrenmenin geleceğini keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="corporate-button text-lg px-8 py-6">
                Ücretsiz Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-navy text-navy hover:bg-navy hover:text-white text-lg px-8 py-6"
              >
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-navy mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">Neden Edulogy?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern eğitim teknolojileri ile tıp öğrenimini daha etkili ve keyifli hale getiriyoruz
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="corporate-gradient p-3 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-navy">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-navy/10 text-navy border-navy/20">Healision Güvencesi</Badge>
              <h2 className="text-4xl font-bold text-navy mb-6">Güvenilir Eğitim Partneri</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Healision'ın 10 yıllık deneyimi ile geliştirilen Edulogy, tıp fakültesi öğrencilerinin ihtiyaçlarını
                anlayarak tasarlanmış kapsamlı bir eğitim platformudur.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Güvenilir ve güncel içerik</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Uzman hekimler tarafından onaylanmış</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Binlerce öğrenci tarafından tercih ediliyor</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-8">
                <div className="text-center">
                  <div className="corporate-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">Hemen Başlayın</h3>
                  <p className="text-muted-foreground mb-6">7 gün ücretsiz deneme ile tüm özellikleri keşfedin</p>
                  <Link href="/register">
                    <Button className="corporate-button w-full">Ücretsiz Deneme Başlat</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Edulogy</h3>
                  <p className="text-sm text-blue-light">by Healision</p>
                </div>
              </div>
              <p className="text-blue-light">Tıp eğitiminde yenilikçi çözümler sunan güvenilir platformunuz.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-blue-light">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Kayıt Ol
                  </Link>
                </li>
                <li>
                  <Link href="/payment" className="hover:text-white transition-colors">
                    Premium
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-blue-light">
                <li>
                  <a href="mailto:support@healision.com" className="hover:text-white transition-colors">
                    Destek
                  </a>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-blue-light">
                <li>info@healision.com</li>
                <li>+90 (212) 123 45 67</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-light mt-8 pt-8 text-center text-blue-light">
            <p>&copy; 2024 Healision. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
