import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Link } from "lucide-react";
import { LucideIcon } from "lucide-react";

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
        <section className="bg-background px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Why DID Annuaire?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        A modern approach to organizational identity verification
                    </p>
                </div>

                {/* Value Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {values.map((value) => (
                        <Card key={value.title} className="border-border/50 transition-shadow hover:shadow-md">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base leading-relaxed">
                                    {value.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
