import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Link, LucideIcon, ArrowRight } from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const values: ValueItem[] = [
  {
    icon: Shield,
    title: "Trusted DID Publishing",
    description:
      "Publish and manage decentralized identifiers with cryptographic proof of ownership and control.",
  },
  {
    icon: Zap,
    title: "Direct Resolution",
    description:
      "Resolve DIDs directly via web infrastructure. No blockchain queries, no latency, no complexity.",
  },
  {
    icon: Link,
    title: "No Intermediary Verification",
    description:
      "Verify organizational identity directly from the source. Full transparency, zero trust assumptions.",
  },
];

export function ValueSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-32">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[var(--primary-50)]/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-[var(--secondary-50)]/30 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why <span className="text-[var(--primary-600)]">DID Annuaire?</span>
          </h2>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-400)]" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A modern approach to organizational identity verification, built for the future of
            trust.
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {values.map((value, index) => (
            <Card
              key={value.title}
              className="group relative overflow-hidden border-border/50 bg-card hover:border-[var(--primary-200)] hover:shadow-xl hover:shadow-[var(--primary-500)]/10 transition-all duration-300"
              style={{
                animationDelay: `${index * 150}ms`,
                // Adding arbitrary class for staggered entrance if utility isn't enough,
                // but using 'animate-in' class wrapper below nicely
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-50)]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <CardHeader className="relative z-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-50)] text-[var(--primary-600)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[var(--primary-100)]">
                  <value.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base leading-relaxed text-muted-foreground/90">
                  {value.description}
                </CardDescription>

                <div className="mt-6 flex items-center text-sm font-medium text-[var(--primary-600)] opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
