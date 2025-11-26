'use client';

/**
 * Payment Success Page
 * Confirmation page after successful payment
 */

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle2, Download, Home, Receipt, Mail } from 'lucide-react';

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const refNo = searchParams.get('ref') || 'LZS-202510-001234';
  const method = searchParams.get('method') || 'fpx';
  const amount = searchParams.get('amount') || '0';

  const methodNames: Record<string, string> = {
    fpx: 'FPX',
    jompay: 'JomPAY',
    ewallet: 'eWallet',
    ipay88: 'iPay88',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl mb-2">Pembayaran Berjaya!</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Terima kasih kerana menunaikan zakat anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Details */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">No. Rujukan</span>
                  <span className="font-mono font-semibold">{refNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Kaedah Pembayaran</span>
                  <Badge>{methodNames[method] || method}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Jumlah</span>
                  <span className="text-xl font-bold text-primary">
                    RM {parseFloat(amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Berjaya
                  </Badge>
                </div>
              </div>

              {/* Receipt Info */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Receipt className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Resit Digital</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Resit digital telah dihantar ke email anda. Anda juga boleh memuat turun resit di sini.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Muat Turun PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Hantar Semula Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-2">
                <h3 className="font-semibold">Seterusnya</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Resit telah dihantar ke email anda</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Resit boleh digunakan untuk potongan cukai pendapatan</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Anda akan menerima notifikasi melalui WhatsApp dan SMS</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Dashboard
                  </Button>
                </Link>
                <Link href="/history" className="flex-1">
                  <Button className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Lihat Sejarah Bayaran
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Memuatkan...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}

