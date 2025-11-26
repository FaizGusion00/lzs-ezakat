'use client';

/**
 * Amil Dashboard Page
 * Dashboard for amil to view collections, commissions, and performance
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  MapPin,
  Calculator,
  ArrowRight,
  Users
} from 'lucide-react';

export default function AmilDashboardPage() {
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

  // Mock data for demo
  const stats = {
    total_collections: 125,
    total_amount: 156250.00,
    total_commission: 3125.00,
    paid_commission: 2500.00,
    pending_commission: 625.00,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Amil</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Urus kutipan zakat dan lihat prestasi anda
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">{stats.total_collections}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4 mr-1" />
                  <span>Transaksi</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Jumlah terkumpul</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Komisyen</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
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
                <CardDescription>Komisyen Tertunggak</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.pending_commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Belum dibayar</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/collect')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kutipan Baru</CardTitle>
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Rekod kutipan zakat baharu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Mula Kutipan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/collections')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Sejarah Kutipan</CardTitle>
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat semua kutipan anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Sejarah
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/commissions')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Komisyen</CardTitle>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat komisyen dan pembayaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Komisyen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Collections */}
          <Card>
            <CardHeader>
              <CardTitle>Kutipan Terkini</CardTitle>
              <CardDescription>5 kutipan terakhir anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tiada kutipan terkini</p>
                <Link href="/amil/collect">
                  <Button variant="outline" className="mt-4">
                    Mula Kutipan Pertama
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

