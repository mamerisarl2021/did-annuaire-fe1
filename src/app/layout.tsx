import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: "DID Annuaire - Gestion d'Identités Décentralisées W3C",
  description:
    "Plateforme française de gestion d'identités décentralisées (DIDs). Créez, gérez et publiez des DID Documents conformes aux standards W3C DID Core et VC v2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fontVariables} font-sans antialiased`}>{children}</body>
    </html>
  );
}
