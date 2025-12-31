import { Shield } from 'lucide-react';
import { typography } from '@/lib/typography';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-400">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-slate-100" />
              <span className="font-heading text-xl font-bold text-slate-100">DID Annuaire</span>
            </div>
            <p className={`max-w-xs ${typography.bodySm}`}>
              La plateforme de référence pour la gestion d&apos;identités décentralisées, conforme
              aux standards W3C et aux exigences de sécurité institutionnelles.
            </p>
          </div>

          <div>
            <h3 className={`mb-4 ${typography.h5} text-slate-100`}>Plateforme</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Sécurité
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`mb-4 ${typography.h5} text-slate-100`}>Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  CGU
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Accessibilité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-xs md:flex-row">
          <p>&copy; {new Date().getFullYear()} DID Annuaire. Tous droits réservés.</p>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <span>Hébergé au Bénin</span>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Conforme RGPD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
