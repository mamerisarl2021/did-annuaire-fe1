import * as React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/landing/Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth Layout
 * Shared layout for Login and Register pages
 * Uses PublicHeader for consistent navigation
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Shared Public Header */}
      <PublicHeader />

      {/* Main Content - Centered */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
