import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-[var(--primary-50)] px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        {/* Headline */}
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to establish trust?
        </h2>

        {/* Supporting text */}
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Join organizations building verifiable, decentralized identity infrastructure. Get started
          today.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/auth/register">Register Your Organization</Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="w-full text-primary hover:text-primary sm:w-auto"
          >
            <Link href="/verify">Verify a DID</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
