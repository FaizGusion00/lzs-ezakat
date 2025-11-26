'use client';

/**
 * Login Page
 * Clean, minimalist login form with individual and company options
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
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak sah'),
  password: z.string().min(8, 'Kata laluan mesti sekurang-kurangnya 8 aksara'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try real API first
      const response = await apiClient.post('/auth/login', {
        ...data,
        device_name: 'web_browser',
      }).catch(() => null);

      if (response?.data?.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        router.push('/dashboard');
        return;
      }

      // Demo mode: Allow login with any email/password for testing
      // In production, this will be removed
      const isDemoMode = !process.env.NEXT_PUBLIC_API_URL || 
                        process.env.NEXT_PUBLIC_API_URL.includes('localhost:8000');
      
      if (isDemoMode) {
        // Simulate successful login for demo
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Determine role based on email
        let role: 'payer_individual' | 'payer_company' | 'amil' | 'admin' | 'super_admin' = 'payer_individual';
        
        if (data.email.includes('admin') || data.email.includes('super_admin')) {
          role = data.email.includes('super') ? 'super_admin' : 'admin';
        } else if (data.email.includes('amil')) {
          role = 'amil';
        } else if (data.email.includes('company') || data.email.includes('syarikat')) {
          role = 'payer_company';
        }
        
        const mockUser = {
          id: 'demo-user-123',
          email: data.email,
          full_name: data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: role,
          is_verified: true,
        };
        
        // Redirect based on role
        let redirectPath = '/dashboard';
        if (role === 'amil') {
          redirectPath = '/amil/dashboard';
        } else if (role === 'admin' || role === 'super_admin') {
          redirectPath = '/admin/dashboard';
        }
        
        const mockToken = 'demo-token-' + Date.now();
        setAuth(mockUser, mockToken);
        router.push(redirectPath);
        return;
      }

      // If not demo mode and API failed
      throw new Error('Log masuk gagal. Sila cuba lagi.');
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 
        err.message ||
        'Log masuk gagal. Sila cuba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Log Masuk</CardTitle>
            <CardDescription>
              Masukkan email dan kata laluan anda untuk mengakses akaun
            </CardDescription>
            {(!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes('localhost:8000')) && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-xs text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  <strong>Demo Mode:</strong> Log masuk dengan sebarang email dan kata laluan (min 8 aksara)
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p><strong>Cara Akses Role:</strong></p>
                  <p>• Email mengandungi <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">amil</code> → Amil Dashboard</p>
                  <p>• Email mengandungi <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin</code> → Admin Dashboard</p>
                  <p>• Email mengandungi <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">company</code> → Company Account</p>
                  <p>• Lain-lain → Individual Account</p>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata Laluan</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Lupa kata laluan?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Log Masuk'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Tiada akaun? </span>
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

