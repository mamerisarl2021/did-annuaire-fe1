import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-card px-6 py-20 text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-[var(--primary-50)] bg-[var(--primary-50)] px-4 py-1.5 text-sm font-medium text-[var(--primary-600)]">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Decentralized Identity
        </div>

        {/* Main Title */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Build <span className="text-primary">Trust</span> with{" "}
          <span className="text-primary">Decentralized</span> Identity
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          DID Annuaire provides a secure, verifiable directory for organizations using{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">did:web</code>{" "}
          identifiers. Establish trust without intermediaries.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/auth/register">Register Organization</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/verify">Verify DID</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
