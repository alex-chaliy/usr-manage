# Project Overview

- **Main Stack:** Angular 22 (Frontend) + NestJS 11 (Backend) + Prisma 8 (ORM) + MongoDB 8.2 (Database) + Nginx 1.30.4 (Reverse Proxy) + Node.js 26.3.0

- **Architecture Style:**
Spec-Driven Development (SDD). Adhere strictly to feature specs in `.github/instructions/`.
Microservices.
Monorepo.

# General Code Style
- **TypeScript:** Strict mode. Prohibit usage of `any`.
- **File Naming:**
  - Use kebab-case for all files (e.g., `user-profile.service.ts`).
  - Use UpperCamelCase for all model files (e.g. `User.model.ts`).


# Frontend Rules (Angular)
- **Components:** Build using Standalone Components and Angular Signals.
- **API Integration:** Keep HTTP calls isolated inside Angular services using typed models that mirror backend responses.
- **State Management**: NGRX Store

- **UI Libs:**
  - PrimeNG 22 for Tables, Dropdowns, Input Fields, Virtual and Infinite Scroll. 


# Backend Rules (NestJS + Prisma + MongoDB)

- **Prisma & MongoDB:** Remember that MongoDB uses ObjectId strings and doesn't support relational SQL migrations; use `prisma db push` or client generation workflows appropriately. Define accurate `@map("_id")` and `@db.ObjectId` mappings in `schema.prisma`.

- **Data Access:** Never call `prisma` directly inside NestJS controllers. Always encapsulate database calls inside injectable Service classes.

- **DTO Validation:** Enforce `class-validator` on all NestJS incoming request payloads.

# Infrastructure & Routing (Nginx)

- **Deployment Boundaries:** Treat Nginx as the reverse proxy handling SSL termination, sub-domain `api.` requests to the NestJS backend container/process,

