export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">DID Annuaire</span>
        </div>

        {/* Powered by */}
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">did:web</code>
        </p>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DID Annuaire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
