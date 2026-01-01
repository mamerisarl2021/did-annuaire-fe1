import { LandingHeader } from '@/components/landing/LandingHeader';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { UseCases } from '@/components/landing/UseCases';
import { CtaSection } from '@/components/landing/CtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DidExplanation } from '@/components/landing/DidExplanation';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeader />
      <Hero />
      <DidExplanation />
      <Features />
      <UseCases />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
