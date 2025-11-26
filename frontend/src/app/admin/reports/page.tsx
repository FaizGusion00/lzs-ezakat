'use client';

/**
 * Admin Reports Page
 * View and export various reports
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Download, FileText, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [reportType, setReportType] = useState('daily_summary');

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

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate export
    alert(`Eksport ${reportType} sebagai ${format.toUpperCase()} akan dimuat turun`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Laporan</h1>
            <p className="text-muted-foreground">
              Lihat dan eksport laporan kutipan zakat
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Jenis Laporan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pilih Laporan</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_summary">Ringkasan Harian</SelectItem>
                        <SelectItem value="monthly_summary">Ringkasan Bulanan</SelectItem>
                        <SelectItem value="yearly_summary">Ringkasan Tahunan</SelectItem>
                        <SelectItem value="amil_performance">Prestasi Amil</SelectItem>
                        <SelectItem value="payment_history">Sejarah Pembayaran</SelectItem>
                        <SelectItem value="zakat_types">Mengikut Jenis Zakat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarikh Dari</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarikh Hingga</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium">Eksport Format</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('pdf')}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('excel')}
                      >
                        Excel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('csv')}
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pratonton Laporan</CardTitle>
                  <CardDescription>
                    {reportType === 'daily_summary' && 'Ringkasan kutipan harian'}
                    {reportType === 'monthly_summary' && 'Ringkasan kutipan bulanan'}
                    {reportType === 'yearly_summary' && 'Ringkasan kutipan tahunan'}
                    {reportType === 'amil_performance' && 'Prestasi dan komisyen amil'}
                    {reportType === 'payment_history' && 'Sejarah semua pembayaran'}
                    {reportType === 'zakat_types' && 'Kutipan mengikut jenis zakat'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Pratonton laporan akan dipaparkan di sini</p>
                      <p className="text-sm mt-2">Pilih jenis laporan dan klik eksport untuk muat turun</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

