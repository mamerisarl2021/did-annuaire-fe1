# Architecture d'Authentification - DID Annuaire

## 🎯 Vue d'ensemble

Architecture complète d'authentification pour la plateforme DID Annuaire, respectant les principes de **Clean Architecture** et **Single Responsibility Principle**.

## 📁 Structure des fichiers

```
src/features/auth/
├── components/
│   ├── AuthLayout.tsx          # Layout partagé (panneau gauche + droite)
│   ├── LoginForm.tsx           # Formulaire de connexion
│   ├── RegisterForm.tsx        # Formulaire d'inscription (3 étapes)
│   ├── ProgressBar.tsx         # Barre de progression
│   └── OtpModal.tsx           # Modal de validation OTP
├── hooks/
│   └── useAuthForm.ts         # Hooks pour la logique des formulaires
├── services/
│   └── auth.service.ts        # Communication avec l'API
├── schemas/
│   └── auth.schema.ts         # Validation Zod
├── types/
│   └── auth.types.ts          # Types TypeScript
└── index.ts                   # Exports centralisés

src/app/(auth)/
├── login/
│   └── page.tsx              # Page de connexion
├── register/
│   └── page.tsx              # Page d'inscription
└── test/
    └── page.tsx              # Page de test
```

## 🔧 Fonctionnalités implémentées

### ✅ Connexion

- Formulaire avec email/mot de passe
- Validation Zod côté client
- Gestion des erreurs
- Interface responsive

### ✅ Inscription (3 étapes)

1. **Organisation** : nom, type, pays, email, téléphone
2. **Administrateur** : prénom, nom, email professionnel
3. **Document** : upload de justificatif (drag & drop)

### ✅ Validation OTP

- Modal élégant après inscription
- Code à 6 chiffres
- Fonction de renvoi avec timer
- Validation automatique

### ✅ Intégration API pays

- Récupération depuis `restcountries.com`
- Mise à jour automatique du préfixe téléphonique
- Affichage des drapeaux

## 🎨 Design System

### Palette de couleurs

Utilise la palette définie dans `src/theme/palettes/`:

- **Primary** : `oklch(0.45 0.18 250)` (bleu institutionnel)
- **Background** : `oklch(1 0 0)` (blanc pur)
- **Muted** : `oklch(0.97 0 0)` (gris très clair)

### Typographie

- **Font Sans** : Inter (UI et corps de texte)
- **Font Heading** : Plus Jakarta Sans (titres)

## 🚀 Utilisation

### Pages disponibles

- `/login` - Connexion utilisateur
- `/register` - Inscription organisation
- `/auth/test` - Page de test des composants

### Hooks disponibles

```typescript
import { useLogin, useRegister, useOtp } from '@/features/auth';

// Dans un composant
const { form, isSubmitting, onSubmit } = useLogin();
const { state, countries, step1Form, nextStep } = useRegister();
const { form, canResend, countdown, handleResend } = useOtp();
```

### Services disponibles

```typescript
import { loginUser, registerOrganization, fetchCountries } from '@/features/auth';

// Appels API
const result = await loginUser({ email, password });
const countries = await fetchCountries();
```

## 🔒 Sécurité

- Validation stricte côté client avec Zod
- Upload de fichiers sécurisé (5Mo max, formats limités)
- Gestion des erreurs réseau
- Authentification OTP obligatoire

## 🎯 Prochaines étapes

1. **Intégration API backend** : remplacer les mocks
2. **Gestion des tokens JWT** : stockage sécurisé
3. **Redirection post-auth** : vers dashboard
4. **Tests unitaires** : composants et hooks
5. **Internationalisation** : support multi-langues

## 📝 Notes techniques

- **Next.js 16** avec App Router
- **React Hook Form** + **Zod** pour les formulaires
- **Tailwind CSS** pour le styling
- **TypeScript strict** pour la sécurité des types
- **Architecture modulaire** pour la maintenabilité

## 🧪 Test de l'architecture

Visitez `/auth/test` pour tester rapidement les composants d'authentification.
