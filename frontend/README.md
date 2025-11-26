# LZS eZakat - Frontend

Frontend application for Sistem Kutipan Zakat Selangor built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn/ui.

## Features

- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Minimalist UI** - Clean, modern interface focused on user experience
- ✅ **Smooth UX Flow** - Intuitive navigation and payment process
- ✅ **Multiple Payment Options** - FPX, JomPAY, eWallet, iPay88 prominently displayed
- ✅ **Individual & Company Support** - Separate registration flows for both user types
- ✅ **Zakat Calculator** - Interactive calculator with real-time preview
- ✅ **Payment Flow** - Complete payment process with all gateway options
- ✅ **Dashboard** - User dashboard with quick actions and overview

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: 
  - React Query (server state)
  - Zustand (client state)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Authentication pages
│   │   ├── calculator/         # Zakat calculator
│   │   ├── pay/               # Payment page
│   │   ├── dashboard/         # User dashboard
│   │   └── payment/           # Payment success
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── store.ts           # Zustand stores
│   └── providers/
│       └── query-provider.tsx # React Query provider
├── public/                     # Static assets
└── package.json
```

## Key Pages

### Landing Page (`/`)
- Hero section showcasing payment ease
- Payment methods prominently displayed
- Individual vs Company comparison
- Features section
- Call-to-action

### Authentication (`/auth/login`, `/auth/register`)
- Clean login form
- Registration with tabs for Individual/Company
- Form validation with Zod
- Error handling

### Calculator (`/calculator`)
- Multiple zakat types
- Real-time calculation preview
- Interactive form with deductions
- Direct link to payment

### Payment (`/pay`)
- All payment methods in grid layout
- Real-time fee calculation
- Payment summary sidebar
- Security and speed highlights

### Dashboard (`/dashboard`)
- Welcome message
- Quick action cards
- Stats overview
- Recent activity

## Design Principles

1. **Minimalist** - Clean, uncluttered interface
2. **Responsive** - Mobile-first design
3. **Accessible** - WCAG compliant components
4. **Fast** - Optimized performance
5. **User-Friendly** - Intuitive navigation

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

## Development Notes

- All API calls use the centralized `apiClient` from `src/lib/api.ts`
- Authentication state is managed with Zustand and persisted in localStorage
- Forms use React Hook Form with Zod validation
- Components are built with Shadcn/ui for consistency

## License

Proprietary - Lembaga Zakat Selangor © 2025
