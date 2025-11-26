'use client';

/**
 * Amil Collection Page
 * Amil can collect payment from payers with GPS tracking
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

const collectionSchema = z.object({
  payer_id: z.string().min(1, 'Sila pilih pembayar'),
  zakat_type_id: z.string().min(1, 'Sila pilih jenis zakat'),
  amount: z.number().min(1, 'Jumlah mesti lebih dari RM 1.00'),
  method: z.literal('cash'),
});

type CollectionForm = z.infer<typeof collectionSchema>;

export default function AmilCollectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      method: 'cash',
    },
  });

  const captureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('GPS Error:', error);
          alert('Tidak dapat mendapatkan lokasi GPS. Sila pastikan GPS diaktifkan.');
        }
      );
    } else {
      alert('GPS tidak disokong oleh peranti anda.');
    }
  };

  const onSubmit = async (data: CollectionForm) => {
    if (!gpsLocation) {
      alert('Sila dapatkan lokasi GPS terlebih dahulu untuk audit.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/amil/dashboard');
    } catch (error) {
      console.error('Error collecting payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Kutipan Zakat</h1>
            <p className="text-muted-foreground">
              Rekod kutipan zakat dengan lokasi GPS untuk audit
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Maklumat Kutipan</span>
              </CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="payer_id">Pembayar</Label>
                  <Select onValueChange={(value) => setValue('payer_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih atau cari pembayar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payer1">Ahmad Bin Ali - 900101011234</SelectItem>
                      <SelectItem value="payer2">Syarikat ABC Sdn Bhd - 123456789</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.payer_id && (
                    <p className="text-sm text-destructive">{errors.payer_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zakat_type_id">Jenis Zakat</Label>
                  <Select onValueChange={(value) => setValue('zakat_type_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis zakat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendapatan">Zakat Pendapatan</SelectItem>
                      <SelectItem value="perniagaan">Zakat Perniagaan</SelectItem>
                      <SelectItem value="emas_perak">Zakat Emas & Perak</SelectItem>
                      <SelectItem value="simpanan">Zakat Simpanan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.zakat_type_id && (
                    <p className="text-sm text-destructive">{errors.zakat_type_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah (RM)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Lokasi GPS</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={captureGPS}
                      disabled={isLoading}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Dapatkan Lokasi
                    </Button>
                    {gpsLocation && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lokasi GPS diperlukan untuk audit dan pematuhan Syariah
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || !gpsLocation}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Rekod Kutipan'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

