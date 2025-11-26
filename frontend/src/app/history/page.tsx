'use client';

/**
 * Payment History Page
 * View all payment transactions
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Receipt, Download, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data for demonstration
  const payments: any[] = [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Bayaran</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Semua transaksi zakat anda
            </p>
          </div>

          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Transaksi</h3>
                  <p className="text-muted-foreground mb-6">
                    Anda belum membuat sebarang pembayaran zakat
                  </p>
                  <Link href="/calculator">
                    <Button>
                      Mula Bayar Zakat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{payment.zakat_type}</h3>
                          <Badge variant={payment.status === 'success' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{payment.paid_at}</span>
                          </div>
                          <span>Ref: {payment.ref_no}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-2xl font-bold text-primary">
                            RM {payment.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

