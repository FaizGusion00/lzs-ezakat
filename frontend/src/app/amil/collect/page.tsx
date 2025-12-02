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
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MapPin, Loader2, CheckCircle2, Search, User, Building2, Calendar, DollarSign, Receipt, AlertCircle, ArrowRight } from 'lucide-react';

const collectionSchema = z.object({
  payer_id: z.string().min(1, 'Sila pilih pembayar'),
  zakat_type_id: z.string().min(1, 'Sila pilih jenis zakat'),
  amount: z.number().min(1, 'Jumlah mesti lebih dari RM 1.00'),
  method: z.literal('cash'),
});

type CollectionForm = z.infer<typeof collectionSchema>;

interface Payer {
  id: string;
  name: string;
  nricOrSsm: string;
  type: 'individual' | 'company';
  email?: string;
  phone?: string;
}

export default function AmilCollectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  
  // Mock payers data
  const mockPayers: Payer[] = [
    { id: 'payer1', name: 'Ahmad Bin Ali', nricOrSsm: '900101011234', type: 'individual', email: 'ahmad@example.com', phone: '0123456789' },
    { id: 'payer2', name: 'Syarikat ABC Sdn Bhd', nricOrSsm: '123456789', type: 'company', email: 'info@abc.com', phone: '03-12345678' },
    { id: 'payer3', name: 'Fatimah Binti Hassan', nricOrSsm: '850505055678', type: 'individual', email: 'fatimah@example.com', phone: '0198765432' },
    { id: 'payer4', name: 'Mohd Zain Bin Ismail', nricOrSsm: '920202021234', type: 'individual', email: 'zain@example.com', phone: '0134567890' },
    { id: 'payer5', name: 'XYZ Trading Sdn Bhd', nricOrSsm: '987654321', type: 'company', email: 'contact@xyz.com', phone: '03-98765432' },
    { id: 'payer6', name: 'Siti Nurhaliza Binti Ahmad', nricOrSsm: '880808088901', type: 'individual', email: 'siti@example.com', phone: '0145678901' },
  ];

  const filteredPayers = mockPayers.filter(payer =>
    payer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payer.nricOrSsm.includes(searchQuery)
  );

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

  // Watch form values after form initialization
  const payerId = watch('payer_id');
  const selectedPayer = payerId ? mockPayers.find(p => p.id === payerId) : null;
  const selectedZakatType = watch('zakat_type_id');
  const amount = watch('amount');

  const captureGPS = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGpsLoading(false);
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsLoading(false);
          alert('Tidak dapat mendapatkan lokasi GPS. Sila pastikan GPS diaktifkan dan berikan kebenaran lokasi.');
        }
      );
    } else {
      setGpsLoading(false);
      alert('GPS tidak disokong oleh peranti anda.');
    }
  };

  // Note: Auto-capture GPS removed to prevent permission prompt on page load
  // User can manually capture GPS when ready

  const onSubmit = async (data: CollectionForm) => {
    if (!gpsLocation) {
      alert('Sila dapatkan lokasi GPS terlebih dahulu untuk audit.');
      return;
    }

    // Show summary before submitting
    if (!showSummary) {
      setShowSummary(true);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Kutipan berjaya direkod! Resit akan dihantar melalui email.');
      router.push('/amil/dashboard');
    } catch (error) {
      console.error('Error collecting payment:', error);
      alert('Ralat berlaku semasa merekod kutipan. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const zakatTypes = [
    { id: 'pendapatan', name: 'Zakat Pendapatan', description: 'Zakat dari pendapatan gaji atau perniagaan' },
    { id: 'perniagaan', name: 'Zakat Perniagaan', description: 'Zakat dari perniagaan atau syarikat' },
    { id: 'emas_perak', name: 'Zakat Emas & Perak', description: 'Zakat dari emas dan perak yang dimiliki' },
    { id: 'simpanan', name: 'Zakat Wang Simpanan', description: 'Zakat dari wang simpanan atau pelaburan' },
    { id: 'fitrah', name: 'Zakat Fitrah', description: 'Zakat fitrah untuk bulan Ramadan' },
  ];

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

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center ${showSummary ? 'text-muted-foreground' : 'text-primary'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showSummary ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Maklumat Kutipan</span>
              </div>
              <div className="flex-1 h-0.5 bg-border mx-4"></div>
              <div className={`flex items-center ${showSummary ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showSummary ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Pengesahan</span>
              </div>
            </div>
          </div>

          {!showSummary ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Maklumat Kutipan</span>
                </CardTitle>
                <CardDescription>
                  Lengkapkan maklumat kutipan zakat dengan tepat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Payer Search & Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="payer_search">Cari Pembayar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="payer_search"
                        type="text"
                        placeholder="Cari nama, MyKad atau No. SSM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchQuery && filteredPayers.length > 0 && (
                      <Card className="mt-2 max-h-60 overflow-y-auto">
                        <CardContent className="p-2">
                          {filteredPayers.map((payer) => (
                            <div
                              key={payer.id}
                              onClick={() => {
                                setValue('payer_id', payer.id);
                                setSearchQuery('');
                              }}
                              className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {payer.type === 'individual' ? (
                                  <User className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{payer.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payer.type === 'individual' ? 'MyKad' : 'SSM'}: {payer.nricOrSsm}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {payer.type === 'individual' ? 'Individu' : 'Syarikat'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    {selectedPayer && (
                      <Card className="mt-2 bg-primary/5 border-primary/20">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {selectedPayer.type === 'individual' ? (
                                <User className="h-5 w-5 text-primary" />
                              ) : (
                                <Building2 className="h-5 w-5 text-primary" />
                              )}
                              <div>
                                <p className="font-semibold">{selectedPayer.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedPayer.type === 'individual' ? 'MyKad' : 'SSM'}: {selectedPayer.nricOrSsm}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setValue('payer_id', '');
                                setSearchQuery('');
                              }}
                            >
                              Tukar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <Select
                      value={watch('payer_id') || ''}
                      onValueChange={(value) => setValue('payer_id', value)}
                    >
                      <SelectTrigger className={selectedPayer ? 'hidden' : ''}>
                        <SelectValue placeholder="Pilih pembayar dari senarai" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPayers.map((payer) => (
                          <SelectItem key={payer.id} value={payer.id}>
                            {payer.name} - {payer.nricOrSsm}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.payer_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.payer_id.message}
                      </p>
                    )}
                  </div>

                  {/* Zakat Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="zakat_type_id">Jenis Zakat</Label>
                    <Select
                      value={watch('zakat_type_id') || ''}
                      onValueChange={(value) => setValue('zakat_type_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis zakat" />
                      </SelectTrigger>
                      <SelectContent>
                        {zakatTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <p className="font-medium">{type.name}</p>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedZakatType && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {zakatTypes.find(t => t.id === selectedZakatType)?.description}
                      </p>
                    )}
                    {errors.zakat_type_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zakat_type_id.message}
                      </p>
                    )}
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah (RM)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        className="pl-10"
                        {...register('amount', { valueAsNumber: true })}
                        disabled={isLoading}
                      />
                    </div>
                    {amount && amount > 0 && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Komisyen (2%):</span>
                          <span className="font-semibold">RM {(amount * 0.02).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                    {errors.amount && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  {/* GPS Location */}
                  <div className="space-y-2">
                    <Label>Lokasi GPS</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={gpsLocation ? "outline" : "default"}
                        onClick={captureGPS}
                        disabled={isLoading || gpsLoading}
                      >
                        {gpsLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Mencari...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            {gpsLocation ? 'Kemas Kini Lokasi' : 'Dapatkan Lokasi'}
                          </>
                        )}
                      </Button>
                      {gpsLocation && (
                        <Card className="flex-1 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="font-medium">Lokasi berjaya diperoleh</span>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                              {gpsLocation.lat.toFixed(6)}°N, {gpsLocation.lng.toFixed(6)}°E
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Lokasi GPS diperlukan untuk audit dan pematuhan Syariah
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading || !gpsLocation || !selectedPayer || !selectedZakatType || !amount}>
                    Teruskan ke Pengesahan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Pengesahan Kutipan</span>
                </CardTitle>
                <CardDescription>
                  Sila semak maklumat sebelum merekod kutipan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {selectedPayer?.type === 'individual' ? (
                            <User className="h-5 w-5 text-primary" />
                          ) : (
                            <Building2 className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <p className="font-semibold">{selectedPayer?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedPayer?.type === 'individual' ? 'MyKad' : 'SSM'}: {selectedPayer?.nricOrSsm}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Jenis Zakat</p>
                        <p className="font-semibold">{zakatTypes.find(t => t.id === selectedZakatType)?.name}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Jumlah</p>
                        <p className="font-semibold text-lg text-primary">
                          RM {amount?.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Komisyen (2%)</span>
                        <span className="font-semibold text-primary">
                          RM {(amount ? amount * 0.02 : 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {gpsLocation && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3" />
                          <span className="font-mono">{gpsLocation.lat.toFixed(6)}°N, {gpsLocation.lng.toFixed(6)}°E</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowSummary(false)}
                      disabled={isLoading}
                    >
                      Kembali
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Rekod Kutipan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

