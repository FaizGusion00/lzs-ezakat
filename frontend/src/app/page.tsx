/**
 * Landing Page
 * Showcases the platform with focus on easy payment process
 */

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  Calculator, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Building2, 
  User,
  ArrowRight,
  Smartphone,
  Mail,
  MessageCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32 min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center">
          {/* Hero Image Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.png"
              alt="Hero Background"
              fill
              priority
              className="object-cover object-center"
              quality={90}
            />
            {/* Dark Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
            {/* Gradient Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center space-y-4 sm:space-y-6">
              <Badge className="mb-4 bg-[#16a34a]/90 backdrop-blur-sm text-white border-[#16a34a]/30 shadow-lg px-4 py-1.5 text-sm font-medium">
                Lembaga Zakat Selangor • eZakat
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                Di Sebalik Senyuman,
                <span className="block text-[#16a34a] drop-shadow-md">Ada Derita.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto px-4 drop-shadow-md">
                Ringankan beban mereka dengan zakat anda. Platform digital rasmi untuk bayaran zakat
                yang selamat, telus dan mudah untuk muzakki individu dan syarikat.
              </p>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl mx-auto italic drop-shadow-sm">
                “Dan dirikanlah oleh kamu akan sembahyang dan tunaikanlah zakat...” (Surah Al-Baqarah, 2:110)
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/calculator">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Kira Zakat Sekarang
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg border-2 border-white/20">
                    Daftar Akaun
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods Section - Highlight */}
        <section id="payment" className="py-12 sm:py-16 lg:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Pelbagai Pilihan Pembayaran</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Bayar zakat dengan cara yang paling mudah untuk anda. Sokongan untuk individu dan syarikat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto">
              {/* FPX */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">FPX</CardTitle>
                  <CardDescription>Online Banking</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bayar terus melalui bank anda. Selamat dan pantas.
                  </p>
                  <Badge variant="outline">RM 1.00</Badge>
                </CardContent>
              </Card>

              {/* JomPAY */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">JomPAY</CardTitle>
                  <CardDescription>Bill Payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bayar melalui kod JomPAY di mana-mana cawangan bank.
                  </p>
                  <Badge variant="outline">RM 0.50</Badge>
                </CardContent>
              </Card>

              {/* eWallet */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">eWallet</CardTitle>
                  <CardDescription>TnG, MAE, ShopeePay</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bayar menggunakan e-wallet kegemaran anda.
                  </p>
                  <Badge variant="outline">1.5%</Badge>
                </CardContent>
              </Card>

              {/* iPay88 */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-lg">iPay88</CardTitle>
                  <CardDescription>Card & More</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kad kredit, kad debit, dan banyak lagi.
                  </p>
                  <Badge variant="outline">2.5%</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Individual vs Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Individu</CardTitle>
                      <CardDescription>Untuk pembayar individu</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Pendaftaran dengan MyKad</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Kira zakat pendapatan</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Bayar dalam 3 minit</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Terima resit digital</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Syarikat</CardTitle>
                      <CardDescription>Untuk syarikat & perniagaan</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Pendaftaran dengan SSM</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Kira zakat perniagaan</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Urus bayaran berbilang</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Laporan automatik</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Mengapa Pilih LZS eZakat?</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Platform yang direka untuk memudahkan proses pembayaran zakat anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Pantas & Mudah</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Proses pembayaran lengkap dalam kurang dari 3 minit. Tiada dokumen fizikal diperlukan.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Selamat & Terjamin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Data anda dilindungi dengan enkripsi terbaik. Pematuhan PCI-DSS dan PDPA.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calculator className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Kalkulator Pintar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Kira zakat anda dengan mudah untuk pelbagai jenis zakat. Auto-kira nisab dan haul.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Resit Digital</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Terima resit digital serta-merta. Boleh digunakan untuk potongan cukai pendapatan.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Notifikasi Automatik</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Terima notifikasi melalui Email, SMS, dan WhatsApp untuk setiap transaksi.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Sokongan Syarikat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Urus bayaran zakat syarikat dengan mudah. Laporan automatik untuk audit.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Sedia untuk Mula?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-foreground/90 max-w-2xl mx-auto px-4">
              Daftar sekarang dan mulakan perjalanan zakat digital anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary">
                  Daftar Akaun Percuma
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Cuba Kalkulator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
