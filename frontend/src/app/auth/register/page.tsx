'use client';

/**
 * Registration Page
 * Clean registration form with individual and company options
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { apiClient } from '@/lib/api';
import { Loader2, User, Building2 } from 'lucide-react';

const individualSchema = z.object({
  role: z.literal('payer_individual'),
  email: z.string().email('Email tidak sah'),
  password: z.string().min(8, 'Kata laluan mesti sekurang-kurangnya 8 aksara'),
  password_confirmation: z.string(),
  full_name: z.string().min(2, 'Nama mesti sekurang-kurangnya 2 aksara'),
  phone: z.string().regex(/^60[0-9]{9,10}$/, 'Nombor telefon tidak sah (format: 60123456789)'),
  mykad_ssm: z.string().min(12, 'MyKad tidak sah'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Kata laluan tidak sepadan',
  path: ['password_confirmation'],
});

const companySchema = z.object({
  role: z.literal('payer_company'),
  email: z.string().email('Email tidak sah'),
  password: z.string().min(8, 'Kata laluan mesti sekurang-kurangnya 8 aksara'),
  password_confirmation: z.string(),
  full_name: z.string().min(2, 'Nama syarikat mesti sekurang-kurangnya 2 aksara'),
  phone: z.string().regex(/^60[0-9]{9,10}$/, 'Nombor telefon tidak sah'),
  mykad_ssm: z.string().min(8, 'Nombor SSM tidak sah'),
});

type IndividualForm = z.infer<typeof individualSchema>;
type CompanyForm = z.infer<typeof companySchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const individualForm = useForm<IndividualForm>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      role: 'payer_individual',
    },
  });

  const companyForm = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      role: 'payer_company',
    },
  });

  const onSubmitIndividual = async (data: IndividualForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/verify?type=email');
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 
        'Pendaftaran gagal. Sila cuba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCompany = async (data: CompanyForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/verify?type=email');
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 
        'Pendaftaran gagal. Sila cuba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Pendaftaran Berjaya!</CardTitle>
              <CardDescription>
                Sila semak email dan SMS anda untuk mengesahkan akaun. Anda akan dialihkan ke halaman pengesahan.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">Daftar Akaun</CardTitle>
            <CardDescription>
              Pilih jenis akaun dan lengkapkan maklumat anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Individu</span>
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Syarikat</span>
                </TabsTrigger>
              </TabsList>

              {/* Individual Registration */}
              <TabsContent value="individual" className="space-y-4 mt-6">
                <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ind-full_name">Nama Penuh</Label>
                      <Input
                        id="ind-full_name"
                        {...individualForm.register('full_name')}
                        disabled={isLoading}
                      />
                      {individualForm.formState.errors.full_name && (
                        <p className="text-sm text-destructive">
                          {individualForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ind-mykad">MyKad</Label>
                      <Input
                        id="ind-mykad"
                        {...individualForm.register('mykad_ssm')}
                        placeholder="900101011234"
                        disabled={isLoading}
                      />
                      {individualForm.formState.errors.mykad_ssm && (
                        <p className="text-sm text-destructive">
                          {individualForm.formState.errors.mykad_ssm.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ind-email">Email</Label>
                    <Input
                      id="ind-email"
                      type="email"
                      {...individualForm.register('email')}
                      disabled={isLoading}
                    />
                    {individualForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {individualForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ind-phone">Nombor Telefon</Label>
                    <Input
                      id="ind-phone"
                      {...individualForm.register('phone')}
                      placeholder="60123456789"
                      disabled={isLoading}
                    />
                    {individualForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {individualForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ind-password">Kata Laluan</Label>
                      <Input
                        id="ind-password"
                        type="password"
                        {...individualForm.register('password')}
                        disabled={isLoading}
                      />
                      {individualForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {individualForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ind-password-confirm">Sahkan Kata Laluan</Label>
                      <Input
                        id="ind-password-confirm"
                        type="password"
                        {...individualForm.register('password_confirmation')}
                        disabled={isLoading}
                      />
                      {individualForm.formState.errors.password_confirmation && (
                        <p className="text-sm text-destructive">
                          {individualForm.formState.errors.password_confirmation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Daftar Akaun Individu'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Company Registration */}
              <TabsContent value="company" className="space-y-4 mt-6">
                <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="comp-name">Nama Syarikat</Label>
                    <Input
                      id="comp-name"
                      {...companyForm.register('full_name')}
                      disabled={isLoading}
                    />
                    {companyForm.formState.errors.full_name && (
                      <p className="text-sm text-destructive">
                        {companyForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="comp-ssm">Nombor SSM</Label>
                      <Input
                        id="comp-ssm"
                        {...companyForm.register('mykad_ssm')}
                        placeholder="123456789"
                        disabled={isLoading}
                      />
                      {companyForm.formState.errors.mykad_ssm && (
                        <p className="text-sm text-destructive">
                          {companyForm.formState.errors.mykad_ssm.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comp-phone">Nombor Telefon</Label>
                      <Input
                        id="comp-phone"
                        {...companyForm.register('phone')}
                        placeholder="60123456789"
                        disabled={isLoading}
                      />
                      {companyForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">
                          {companyForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comp-email">Email Syarikat</Label>
                    <Input
                      id="comp-email"
                      type="email"
                      {...companyForm.register('email')}
                      disabled={isLoading}
                    />
                    {companyForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {companyForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="comp-password">Kata Laluan</Label>
                      <Input
                        id="comp-password"
                        type="password"
                        {...companyForm.register('password')}
                        disabled={isLoading}
                      />
                      {companyForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {companyForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comp-password-confirm">Sahkan Kata Laluan</Label>
                      <Input
                        id="comp-password-confirm"
                        type="password"
                        {...companyForm.register('password_confirmation')}
                        disabled={isLoading}
                      />
                      {companyForm.formState.errors.password_confirmation && (
                        <p className="text-sm text-destructive">
                          {companyForm.formState.errors.password_confirmation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Daftar Akaun Syarikat'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Sudah ada akaun? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Log masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

