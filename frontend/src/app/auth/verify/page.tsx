'use client';

/**
 * Email & SMS Verification Page
 * User can verify email and phone number
 */

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Mail, Smartphone, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

const emailVerificationSchema = z.object({
  code: z.string().length(6, 'Kod mesti 6 digit'),
});

const smsVerificationSchema = z.object({
  code: z.string().length(6, 'Kod mesti 6 digit'),
});

type EmailVerificationForm = z.infer<typeof emailVerificationSchema>;
type SMSVerificationForm = z.infer<typeof smsVerificationSchema>;

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'email';
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailForm = useForm<EmailVerificationForm>({
    resolver: zodResolver(emailVerificationSchema),
  });

  const smsForm = useForm<SMSVerificationForm>({
    resolver: zodResolver(smsVerificationSchema),
  });

  const onSubmitEmail = async (data: EmailVerificationForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Kod tidak sah. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSMS = async (data: SMSVerificationForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Kod tidak sah. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error resending code:', error);
    }
  };

  if (isVerified) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Pengesahan Berjaya!</CardTitle>
              <CardDescription>
                {type === 'email' ? 'Email anda telah disahkan' : 'Nombor telefon anda telah disahkan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Mengalihkan ke dashboard...
              </p>
            </CardContent>
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">Pengesahan Akaun</CardTitle>
            <CardDescription>
              Sila masukkan kod pengesahan yang telah dihantar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={type} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <Smartphone className="h-4 w-4 mr-2" />
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email_code">Kod Pengesahan Email</Label>
                    <Input
                      id="email_code"
                      placeholder="123456"
                      maxLength={6}
                      {...emailForm.register('code')}
                      disabled={isLoading}
                    />
                    {emailForm.formState.errors.code && (
                      <p className="text-sm text-destructive">
                        {emailForm.formState.errors.code.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Kod 6 digit telah dihantar ke email anda
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengesahkan...
                      </>
                    ) : (
                      'Sahkan Email'
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResend}
                      disabled={resendCooldown > 0}
                      className="text-sm"
                    >
                      {resendCooldown > 0
                        ? `Hantar semula dalam ${resendCooldown}s`
                        : 'Hantar semula kod'}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="sms">
                <form onSubmit={smsForm.handleSubmit(onSubmitSMS)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sms_code">Kod Pengesahan SMS</Label>
                    <Input
                      id="sms_code"
                      placeholder="123456"
                      maxLength={6}
                      {...smsForm.register('code')}
                      disabled={isLoading}
                    />
                    {smsForm.formState.errors.code && (
                      <p className="text-sm text-destructive">
                        {smsForm.formState.errors.code.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Kod 6 digit telah dihantar ke nombor telefon anda
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengesahkan...
                      </>
                    ) : (
                      'Sahkan SMS'
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResend}
                      disabled={resendCooldown > 0}
                      className="text-sm"
                    >
                      {resendCooldown > 0
                        ? `Hantar semula dalam ${resendCooldown}s`
                        : 'Hantar semula kod'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <Link href="/auth/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Log Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground">Memuatkan...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}

