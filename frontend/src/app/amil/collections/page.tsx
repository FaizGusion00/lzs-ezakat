'use client';

/**
 * Amil Collections Page
 * View all collections made by amil
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Receipt, MapPin, Calendar } from 'lucide-react';

export default function AmilCollectionsPage() {
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

  const collections: any[] = [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Kutipan</h1>
            <p className="text-muted-foreground">
              Semua kutipan zakat yang telah anda rekod
            </p>
          </div>

          {collections.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Kutipan</h3>
                  <p className="text-muted-foreground mb-6">
                    Anda belum membuat sebarang kutipan
                  </p>
                  <button
                    onClick={() => router.push('/amil/collect')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Mula Kutipan Pertama
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {collections.map((collection) => (
                <Card key={collection.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{collection.payer_name}</h3>
                          <Badge>{collection.zakat_type}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{collection.collected_at}</span>
                          </div>
                          {collection.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>GPS: {collection.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-2">
                          <span className="text-2xl font-bold text-primary">
                            RM {collection.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
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

