'use client';

/**
 * Admin Dashboard Page
 * Admin dashboard with reports, analytics, and monitoring
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
  Users, 
  Receipt,
  Building2,
  Download,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  // Mock data
  const stats = {
    total_collection: 1562500.00,
    total_transactions: 1250,
    success_rate: 98.5,
    active_payers: 850,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Pemantauan dan laporan kutipan zakat
              </p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Eksport Laporan
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-3xl">
                  RM {stats.total_collection.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5% dari bulan lepas</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Transaksi</CardDescription>
                <CardTitle className="text-3xl">{stats.total_transactions.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4 mr-1" />
                  <span>Transaksi berjaya</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Kadar Kejayaan</CardDescription>
                <CardTitle className="text-3xl">{stats.success_rate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Pembayaran berjaya</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pembayar Aktif</CardDescription>
                <CardTitle className="text-3xl">{stats.active_payers.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Pengguna aktif</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/reports')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Laporan</CardTitle>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat laporan harian, bulanan, dan tahunan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/users')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pengurusan Pengguna</CardTitle>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Urus pengguna, amil, dan syarikat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Urus Pengguna
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/amil-performance')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Prestasi Amil</CardTitle>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Pantau prestasi dan komisyen amil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Prestasi
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kutipan Mengikut Jenis Zakat</CardTitle>
                <CardDescription>Bulan semasa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 opacity-50" />
                  <p className="ml-2">Carta akan dipaparkan di sini</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kutipan Mengikut Kaedah Bayaran</CardTitle>
                <CardDescription>Bulan semasa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 opacity-50" />
                  <p className="ml-2">Carta akan dipaparkan di sini</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

