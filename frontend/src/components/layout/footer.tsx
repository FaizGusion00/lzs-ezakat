/**
 * Footer Component
 * Site footer with links and information
 */

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">Z</span>
              </div>
              <span className="font-bold text-lg">LZS eZakat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform digital end-to-end untuk kutipan zakat dengan ketelusan, keselamatan, dan kecekapan tinggi.
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
              <li>Shah Alam, Selangor</li>
              <li>Email: info@zakat-selangor.gov.my</li>
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

