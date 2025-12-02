/**
 * Footer Component
 * Site footer with links and information
 */

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/5 flex items-center justify-center">
                <Image
                  src="/lzs-logo.png"
                  alt="Lembaga Zakat Selangor"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm">Lembaga Zakat Selangor</span>
                <span className="text-xs text-muted-foreground">eZakat • Kutipan & Rekod Zakat Digital</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform digital rasmi untuk memudahkan muzakki menunaikan zakat dengan selamat, telus dan
              teratur selaras dengan visi Lembaga Zakat Selangor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Pautan Pantas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kalkulator Zakat
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Daftar Akaun
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ciri-ciri
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Soalan Lazim
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Hubungi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Lembaga Zakat Selangor</li>
              <li>Talian Zakat Selangor: 1-300-88-4343</li>
              <li>Email: maklumbalasaduan@zakatselangor.com.my</li>
              <li>
                <Link 
                  href="https://www.zakatselangor.com.my" 
                  className="hover:text-foreground underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.zakatselangor.com.my
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lembaga Zakat Selangor. Hak cipta terpelihara.</p>
        </div>
      </div>
    </footer>
  );
}

