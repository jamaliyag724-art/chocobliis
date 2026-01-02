# Choco Blossom India - E-commerce Platform

## Overview

This is a production-ready e-commerce website for "Choco Blossom India," a brand selling handmade chocolates, gift hampers, personalized gift combos, and festive gift boxes. The platform features a modern, elegant design targeting premium gifting customers in Ahmedabad, Gujarat.

The application follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for cart state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Storage
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle table definitions
- **Migrations**: Generated via `drizzle-kit push` command
- **Core Tables**: products, categories, reviews, enquiries

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `/shared` directory are consumed by both frontend and backend
- **Type Safety**: End-to-end TypeScript with Zod schemas for runtime validation
- **Component Library**: shadcn/ui components in `client/src/components/ui/` with Radix UI primitives
- **Custom Hooks**: Business logic abstracted into hooks (`use-cart`, `use-shop`, `use-toast`)

### Build System
- **Development**: `tsx` for running TypeScript directly
- **Production Build**: Custom build script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public/`

## External Dependencies

### Database
- PostgreSQL database (required, connection string via DATABASE_URL)
- Drizzle ORM for queries and schema management
- connect-pg-simple for session storage capability

### UI Framework Dependencies
- Radix UI primitives (accordion, dialog, dropdown, etc.)
- Tailwind CSS with custom theme configuration
- Lucide React for icons
- Embla Carousel for product image galleries

### Form & Validation
- React Hook Form with Zod resolver
- Zod for schema validation (shared between client/server)

### Development Tools
- Vite dev server with HMR
- Replit-specific plugins (runtime error overlay, cartographer, dev banner)