import { PublicHeader } from "@/components/layout/PublicHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { ValueSection } from "@/components/landing/ValueSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <ValueSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
