# DID Annuaire

A secure, verifiable directory for organizations using `did:web` decentralized identifiers. Establish trust without intermediaries.

## Features

- **Trusted DID Publishing** – Publish and manage decentralized identifiers with cryptographic proof
- **Direct Resolution** – Resolve DIDs via web infrastructure without blockchain complexity
- **No Intermediary Verification** – Verify organizational identity directly from the source
- **Responsive Navigation** – Optimized for all devices with a mobile-friendly menu system
- **Advanced Data Views** – Sortable, filterable, and paginated data tables for managing organization data

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Data Tables**: [@tanstack/react-table](https://tanstack.com/table/v8)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
app/
 ├── (public)/
 │   └── page.tsx              # Landing page composition
 ├── not-found.tsx             # Custom 404 Error Page
 └── globals.css               # Global styles and variables

components/
 ├── landing/                  # Landing page sections
 │   ├── HeroSection.tsx
 │   ├── ValueSection.tsx
 │   ├── CTASection.tsx
 │   └── Footer.tsx
 ├── layout/
 │   └── PublicHeader.tsx      # Responsive header with mobile menu
 └── ui/                       # shadcn/ui components
     ├── button.tsx
     ├── card.tsx
     ├── data-table.tsx        # Advanced Data Table component
     ├── form.tsx
     ├── input.tsx
     ├── sheet.tsx             # Mobile navigation drawer
     └── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd did-annuaire-fe1

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm run start`      | Start production server      |
| `npm run lint`       | Run ESLint                   |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format`     | Format code with Prettier    |

## Design System

### Colors

| Variable          | Hex       | Usage                   |
| ----------------- | --------- | ----------------------- |
| `--primary-600`   | `#0052CC` | Primary brand color     |
| `--primary-500`   | `#0065FF` | Primary accent          |
| `--secondary-400` | `#00B8D9` | Secondary / Innovation  |
| `--accent-500`    | `#F7931A` | Accent highlights       |
| `--neutral-900`   | `#172B4D` | Main text               |
| `--neutral-600`   | `#5E6C84` | Secondary text          |
| `--bg-app`        | `#F4F5F7` | App background          |
| `--bg-surface`    | `#FFFFFF` | Card/surface background |

## Architecture Principles

- **100% Presentational**: No API calls, no complex state in UI components
- **Clean Separation**: Each component has a single responsibility
- **shadcn/ui Only**: All interactive elements use shadcn/ui components
- **Accessibility First**: Keyboard navigable, ARIA-compliant (via Radix UI)

## License

MIT

---

**Powered by `did:web`**
