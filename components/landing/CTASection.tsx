import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] opacity-70" />

      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white opacity-40 blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-[var(--primary-100)] opacity-40 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center relative">
        {/* Headline */}
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
          Ready to establish <span className="text-[var(--primary-600)]">trust?</span>
        </h2>

        {/* Supporting text */}
        <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground leading-relaxed mb-10">
          Join organizations building verifiable, decentralized identity infrastructure. Get started
          today and take control of your digital identity.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="group relative h-14 overflow-hidden rounded-full bg-[var(--primary-600)] px-10 text-lg font-bold text-white shadow-xl shadow-[var(--primary-600)]/20 transition-all hover:scale-105 hover:bg-[var(--primary-500)] hover:shadow-2xl hover:shadow-[var(--primary-600)]/40"
          >
            <Link href="/auth/register">
              <span className="relative z-10 flex items-center">
                Register Your Organization
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="h-14 rounded-full text-lg font-medium text-foreground/80 hover:bg-white/50 hover:text-foreground"
          >
            <Link href="/resolve">Resolve a DID</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
