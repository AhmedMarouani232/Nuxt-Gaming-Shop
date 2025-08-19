# NexTech E-commerce Platform

## Overview

NexTech is a modern, full-stack e-commerce platform specializing in gaming accessories, computers, and technology products. Built with React/TypeScript on the frontend and Express.js on the backend, it provides a comprehensive shopping experience with features including product browsing, cart management, user authentication, pre-orders, deals, and payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand stores for global state (auth, cart, filters) with persistence
- **UI Components**: Shadcn/ui component library built on Radix UI primitives and Tailwind CSS
- **Styling**: Tailwind CSS with a dark gaming-themed design system
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Authentication**: Passport.js with local strategy and bcrypt for password hashing
- **Session Management**: Express sessions with in-memory store for development
- **Data Layer**: In-memory storage implementation with interfaces for future database migration
- **API Design**: RESTful endpoints following conventional patterns

### Data Storage
- **Current**: In-memory storage with pre-seeded product catalog (30+ gaming products)
- **Migration Ready**: Drizzle ORM configured for PostgreSQL with comprehensive schema
- **Database Schema**: 
  - Users table with Stripe integration fields
  - Products table with gaming-specific attributes (specs, compatibility, features)
  - Cart items with user-product relationships
  - Orders table for purchase history

### Key Features & Design Patterns
- **Product Management**: Advanced filtering system with real-time search, category/brand filters, price ranges, and feature-based filtering
- **Shopping Experience**: Persistent cart, product recommendations, pre-order system, deals/promotions
- **User Experience**: Responsive design, loading states, error handling, toast notifications
- **Performance**: Optimistic updates, query caching with TanStack Query, image optimization

### Security & Authentication
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Security**: HTTP-only cookies, CSRF protection ready
- **Input Validation**: Zod schemas for runtime type checking
- **Authorization**: Route protection with authentication guards

## External Dependencies

### Payment Processing
- **Stripe**: Payment processing with React Stripe.js integration
- **Configuration**: Environment variables for API keys (STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY)

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL provider for production deployment
- **Migration System**: Drizzle Kit for schema management and migrations

### Development & Deployment
- **Replit Integration**: Vite plugins for runtime error handling and development cartographer
- **TypeScript**: Strict type checking across client, server, and shared modules
- **Build Process**: ESBuild for server bundling, Vite for client optimization

### UI & Styling
- **Radix UI**: Accessible primitive components for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Modern icon library for consistent iconography
- **Google Fonts**: Custom font stack (Inter, DM Sans, Fira Code, Geist Mono)

### State & Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Zustand**: Lightweight state management with persistence middleware
- **React Hook Form**: Form handling with Zod validation integration

The architecture is designed for scalability with clear separation of concerns, type safety throughout the stack, and easy migration from in-memory storage to a production database system.