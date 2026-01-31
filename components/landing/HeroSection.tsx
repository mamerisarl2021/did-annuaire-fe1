import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-20 text-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary-50)] opacity-70 blur-[100px]" />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[var(--secondary-50)] opacity-50 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--primary-50)] opacity-50 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Badge */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 mx-auto w-fit">
          <div className="inline-flex items-center rounded-full border border-[var(--primary-200)] bg-[var(--primary-50)]/50 px-4 py-1.5 text-sm font-medium text-[var(--primary-600)] shadow-[0_0_20px_-5px_var(--primary-500)] backdrop-blur-sm transition-transform hover:scale-105">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span className="relative">
              Decentralized Identity
              <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--primary-500)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build <span className="relative inline-block text-[var(--primary-600)] after:absolute after:bottom-2 after:left-0 after:-z-10 after:h-3 after:w-full after:bg-[var(--primary-50)]/50 after:content-['']">Trust</span> with{" "}
          <span className="bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-400)] bg-clip-text text-transparent">
            Decentralized
          </span>{" "}
          Identity
        </h1>

        {/* Subtitle */}
        <p className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
          DID Annuaire provides a secure, verifiable directory for organizations using{" "}
          <code className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-sm font-semibold text-foreground">
            did:web
          </code>{" "}
          identifiers. Establish trust without intermediaries.
        </p>

        {/* CTA Buttons */}
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="group relative h-12 overflow-hidden rounded-full bg-[var(--primary-600)] px-8 text-base font-semibold text-white shadow-lg shadow-[var(--primary-600)]/25 transition-all hover:scale-105 hover:bg-[var(--primary-500)] hover:shadow-xl hover:shadow-[var(--primary-600)]/35"
          >
            <Link href="/auth/register">
              <span className="relative z-10 flex items-center">
                Register Organization
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-12 border-2 border-border/50 rounded-full px-8 text-base font-medium text-foreground transition-all hover:border-[var(--primary-200)] hover:bg-[var(--primary-50)]/50"
          >
            <Link href="/resolve">Resolve a DID</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
