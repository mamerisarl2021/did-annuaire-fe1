interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth Layout
 * Centers content for Login and Register pages.
 * Inherits PublicHeader and Footer from the parent (public) layout.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
