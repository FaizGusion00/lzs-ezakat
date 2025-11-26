'use client';

/**
 * Calculation History Page
 * View all saved zakat calculations
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calculator, Receipt, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CalculationsPage() {
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
  const calculations: any[] = [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Pengiraan</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Semua pengiraan zakat yang telah anda simpan
            </p>
          </div>

          {calculations.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Calculator className="h-12 w-12 mx-auto opacity-50 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold mb-2">Tiada Pengiraan Disimpan</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pengiraan zakat yang anda buat akan disimpan di sini untuk rujukan masa hadapan
                    </p>
                    <Link href="/calculator">
                      <Button>
                        <Calculator className="mr-2 h-4 w-4" />
                        Kira Zakat Sekarang
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {calculations.map((calc) => (
                <Card key={calc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{calc.zakat_type}</h3>
                          <Badge variant={calc.status === 'wajib' ? 'default' : 'secondary'}>
                            {calc.status === 'wajib' ? 'Wajib' : 'Tidak Wajib'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Jumlah Bersih</p>
                            <p className="font-medium">RM {calc.amount_net?.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Zakat Diwajibkan</p>
                            <p className="font-medium text-primary">RM {calc.zakat_due?.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tarikh</p>
                            <p className="font-medium flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {calc.created_at || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium">
                              {calc.is_paid ? (
                                <Badge variant="default" className="text-xs">
                                  <Receipt className="h-3 w-3 mr-1" />
                                  Telah Dibayar
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Belum Dibayar
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!calc.is_paid && (
                          <Link href={`/pay?amount=${calc.zakat_due}&type=${calc.zakat_type}`}>
                            <Button size="sm" variant="default">
                              Bayar Sekarang
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
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

