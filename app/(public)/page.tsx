import { HeroSection } from "@/components/landing/HeroSection";
import { ValueSection } from "@/components/landing/ValueSection";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ValueSection />
      <CTASection />
    </div>
  );
}
