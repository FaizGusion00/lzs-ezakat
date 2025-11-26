'use client';

/**
 * Amil Commissions Page
 * View commission history and payments
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DollarSign, CheckCircle2, Clock } from 'lucide-react';

export default function AmilCommissionsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'amil') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'amil') {
    return null;
  }

  // Mock data
  const summary = {
    total_earned: 3125.00,
    total_paid: 2500.00,
    total_pending: 625.00,
  };

  const commissions: any[] = [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Komisyen Saya</h1>
            <p className="text-muted-foreground">
              Lihat sejarah komisyen dan pembayaran
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Komisyen</CardDescription>
                <CardTitle className="text-2xl">
                  RM {summary.total_earned.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>2% dari kutipan</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Sudah Dibayar</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  RM {summary.total_paid.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Dibayar</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tertunggak</CardDescription>
                <CardTitle className="text-2xl text-orange-600">
                  RM {summary.total_pending.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Menunggu pembayaran</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commission History */}
          <Card>
            <CardHeader>
              <CardTitle>Sejarah Komisyen</CardTitle>
              <CardDescription>Semua komisyen dari kutipan anda</CardDescription>
            </CardHeader>
            <CardContent>
              {commissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Tiada komisyen lagi</p>
                  <p className="text-sm mt-2">Komisyen akan muncul selepas kutipan berjaya</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">RM {commission.amount}</p>
                        <p className="text-sm text-muted-foreground">{commission.payment_ref}</p>
                      </div>
                      <Badge variant={commission.is_paid ? 'default' : 'secondary'}>
                        {commission.is_paid ? 'Dibayar' : 'Tertunggak'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

