# ContentHub - Modern Content Management Platform

## Overview

ContentHub is a full-stack content management platform built for sharing articles and posts. It features user authentication via Replit Auth, content creation with file uploads, categorization system, engagement metrics (views and likes), commenting functionality, and administrative controls. The platform uses a modern React frontend with a Node.js/Express backend and PostgreSQL database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Core frontend framework with full type safety
- **Vite**: Build tool and development server for fast hot module replacement
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Server state management with caching and synchronization
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives for accessible UI components

### Backend Architecture  
- **Express.js**: Web application framework with TypeScript support
- **RESTful API**: Standard HTTP endpoints for all data operations
- **File Upload System**: Multer-based file handling with local storage
- **Session Management**: PostgreSQL-backed session storage using connect-pg-simple
- **Email Integration**: Nodemailer for contact form and notification emails

### Authentication & Authorization
- **Replit Auth**: OpenID Connect-based authentication system
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Role-based Access**: Admin privileges controlled by email address configuration
- **Session-based**: Secure session cookies with PostgreSQL persistence

### Database Design
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Drizzle ORM**: Type-safe database operations with automatic migrations
- **Relational Schema**: Users, categories, posts, comments, files, views, likes, and site settings
- **Foreign Key Constraints**: Proper data relationships and referential integrity

### File Management
- **Local File Storage**: Uploaded files stored in local filesystem
- **File Type Validation**: Support for images, documents, and common file types
- **Unique File Naming**: UUID-based filenames to prevent conflicts
- **Static File Serving**: Express middleware for serving uploaded content

### State Management
- **React Query**: Server state caching and synchronization
- **Local Component State**: React hooks for UI state management
- **Form Handling**: Controlled components with validation

## External Dependencies

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit**: Development environment and authentication provider

### UI & Styling
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

### File & Email Services
- **Multer**: Multipart form data handling for file uploads
- **Nodemailer**: SMTP email sending for contact forms
- **MIME Type Detection**: File type validation and security

### Authentication
- **OpenID Connect**: Modern authentication protocol via Replit
- **Passport.js**: Authentication middleware ecosystem
- **Connect PG Simple**: PostgreSQL session store integration