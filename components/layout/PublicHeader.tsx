"use client";

import Image from "next/image";
import {
  Home,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  LayoutDashboard,
  MessageSquareDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserMenu } from "@/lib/features/auth/components/UserMenu";
import { authService } from "@/lib/features/auth/services/auth.service";

export function PublicHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src="/logo.png" alt="DID Annuaire" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-semibold text-foreground tracking-tight">DID Annuaire</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/auth/register">
              <UserPlus className="size-4" />
              Register
            </Link>
          </Button>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/resolve">
              <MessageSquareDot className="size-4" />
              Resolve DID
            </Link>
          </Button>
        </nav>

        {/* Desktop: UserMenu if authenticated, Login button if not */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button variant="outline" asChild className="gap-2">
              <Link href="/auth/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Show UserMenu on mobile if authenticated */}
          {isAuthenticated && <UserMenu />}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Image src="/logo.png" alt="Logo" width={24} height={24} className="h-6 w-6" />
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="justify-start gap-3 h-11"
                >
                  <Link href="/">
                    <Home className="size-4 text-muted-foreground" />
                    <span>Home</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="justify-start gap-3 h-11"
                >
                  <Link href="/auth/register">
                    <UserPlus className="size-4 text-muted-foreground" />
                    <span>Register Organization</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="justify-start gap-3 h-11"
                >
                  <Link href="/resolve">
                    <MessageSquareDot className="size-4 text-muted-foreground" />
                    <span>Resolve DID</span>
                  </Link>
                </Button>

                <div className="my-2 border-t border-border" />

                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      onClick={() => setIsOpen(false)}
                      className="justify-start gap-3 h-11"
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="size-4 text-muted-foreground" />
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        setIsOpen(false);
                        await authService.logout();
                        setIsAuthenticated(false);
                        router.push("/");
                      }}
                      className="justify-start gap-3 h-11 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    asChild
                    onClick={() => setIsOpen(false)}
                    className="justify-start gap-3 h-11"
                  >
                    <Link href="/auth/login">
                      <LogIn className="size-4" />
                      <span>Login to Account</span>
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
