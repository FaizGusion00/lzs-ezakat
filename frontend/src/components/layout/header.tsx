'use client';

/**
 * Header Component
 * Responsive navigation header with authentication state
 */

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut, User, Calculator, Receipt, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-primary/5 flex items-center justify-center">
            <Image
              src="/lzs-logo.png"
              alt="Lembaga Zakat Selangor"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-semibold text-sm text-foreground">
              Lembaga Zakat Selangor
            </span>
            <span className="text-xs text-muted-foreground">
              eZakat • Sentiasa Bersama, Sentiasa Menjaga
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' || user?.role === 'super_admin' ? (
                <>
                  <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard Admin
                  </Link>
                  <Link href="/admin/reports" className="text-sm font-medium hover:text-primary transition-colors">
                    Laporan
                  </Link>
                </>
              ) : user?.role === 'amil' ? (
                <>
                  <Link href="/amil/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard Amil
                  </Link>
                  <Link href="/amil/collect" className="text-sm font-medium hover:text-primary transition-colors">
                    Kutipan
                  </Link>
                  <Link href="/amil/commissions" className="text-sm font-medium hover:text-primary transition-colors">
                    Komisyen
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
                    Kalkulator
                  </Link>
                  <Link href="/calculations" className="text-sm font-medium hover:text-primary transition-colors">
                    Pengiraan
                  </Link>
                  <Link href="/pay" className="text-sm font-medium hover:text-primary transition-colors">
                    Bayaran
                  </Link>
                  <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
                    Sejarah
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
                Kalkulator Zakat
              </Link>
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Ciri-ciri
              </Link>
            </>
          )}
        </nav>

        {/* Theme + Auth Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user ? getInitials(user.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'admin' || user?.role === 'super_admin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      Dashboard Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'amil' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/amil/dashboard" className="cursor-pointer">
                        Dashboard Amil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/amil/commissions" className="cursor-pointer">
                        Komisyen
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/calculator" className="cursor-pointer">
                    <Calculator className="mr-2 h-4 w-4" />
                    Kalkulator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/calculations" className="cursor-pointer">
                    <Calculator className="mr-2 h-4 w-4" />
                    Sejarah Pengiraan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history" className="cursor-pointer">
                    <Receipt className="mr-2 h-4 w-4" />
                    Sejarah Bayaran
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Log Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' || user?.role === 'super_admin' ? (
                      <>
                        <Link href="/admin/dashboard" className="flex items-center space-x-2 text-lg">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Admin</span>
                        </Link>
                        <Link href="/admin/reports" className="flex items-center space-x-2 text-lg">
                          <Receipt className="h-5 w-5" />
                          <span>Laporan</span>
                        </Link>
                      </>
                    ) : user?.role === 'amil' ? (
                      <>
                        <Link href="/amil/dashboard" className="flex items-center space-x-2 text-lg">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Amil</span>
                        </Link>
                        <Link href="/amil/collect" className="flex items-center space-x-2 text-lg">
                          <Receipt className="h-5 w-5" />
                          <span>Kutipan</span>
                        </Link>
                        <Link href="/amil/commissions" className="flex items-center space-x-2 text-lg">
                          <Receipt className="h-5 w-5" />
                          <span>Komisyen</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/dashboard" className="flex items-center space-x-2 text-lg">
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link href="/calculator" className="flex items-center space-x-2 text-lg">
                          <Calculator className="h-5 w-5" />
                          <span>Kalkulator</span>
                        </Link>
                        <Link href="/calculations" className="flex items-center space-x-2 text-lg">
                          <Calculator className="h-5 w-5" />
                          <span>Pengiraan</span>
                        </Link>
                        <Link href="/pay" className="flex items-center space-x-2 text-lg">
                          <Receipt className="h-5 w-5" />
                          <span>Bayaran</span>
                        </Link>
                        <Link href="/history" className="flex items-center space-x-2 text-lg">
                          <Receipt className="h-5 w-5" />
                          <span>Sejarah</span>
                        </Link>
                        <Link href="/profile" className="flex items-center space-x-2 text-lg">
                          <User className="h-5 w-5" />
                          <span>Profil</span>
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/calculator" className="text-lg">Kalkulator Zakat</Link>
                    <Link href="/#features" className="text-lg">Ciri-ciri</Link>
                    <Link href="/auth/login" className="text-lg">Log Masuk</Link>
                    <Link href="/auth/register" className="text-lg">Daftar</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

