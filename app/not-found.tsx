import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-6 pb-2 pt-10 text-center">
          {/* Error Code - Large but subtle */}
          <p className="text-8xl font-bold tracking-tight text-primary/80">404</p>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-foreground">Page introuvable</h1>

          {/* Description - One line */}
          <p className="text-muted-foreground">
            La page demandée n&apos;existe pas ou a été déplacée.
          </p>
        </CardHeader>

        <CardContent className="space-y-3 px-8 pb-10 pt-6">
          {/* Primary Action */}
          <Button asChild className="w-full" size="lg">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>

          {/* Secondary Action */}
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/contact">Contactez-nous</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
