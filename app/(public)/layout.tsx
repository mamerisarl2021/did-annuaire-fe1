import * as React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/landing/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
