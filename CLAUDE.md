# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server
npm start                    # ng serve → http://localhost:4200

# Build
npm run build                # production build
npm run watch                # dev build with watch mode

# Tests
npm test                     # run all tests with Karma
# Run a single test file (example):
npx ng test --include='src/app/features/studio/**/*.spec.ts'

# SSR (after build)
npm run serve:ssr:tattooart
```

## Architecture

Angular 19 SPA with SSR (`@angular/ssr`). The app connects to a Spring Boot backend at `localhost:8080/tattooart/v1/`.

### Module structure

```
src/app/
  app.routes.ts          # Root lazy routes (3 route groups)
  core/
    services/            # Singleton services: one per entity (HttpClient wrappers)
    guards/              # login.guard, user.guard
    interceptors/        # studio.interceptor (JWT Bearer injection)
    layout/
      header/            # App header with nav and logout
      footer/            # App footer
    exceptions/          # Base Exception class used by login/register
  features/              # Page-level components grouped by domain
    auth/                # login, register
    studio/
      studio.routes.ts   # Route definitions co-located with the feature
      studio-list/       # Public listing with filters and favourites
      studio-detail/     # Detail view with gallery, reviews, artists
      filter/            # Filter sub-component
    artist/              # artist-detail (used as sub-component in studio-detail)
    owner-studio/
      owner-studio.routes.ts
      admin-studios-list/  # CRUD studios
      admin-artists-list/  # CRUD artists
      lateral-menu/
    user/
      user.routes.ts
      user-profile/      # Favourites management
  shared/
    components/          # Reusable UI components
      gallery/           # mat-dialog-gallery (Swiper carousel)
      review/            # mat-dialog-reviews, mat-dialog-create-review
      google-maps/       # GoogleMapsComponent wrapper
      paginator/         # PaginatorComponent (Material paginator wrapper)
    models/
      interfaces/        # TypeScript interfaces (Studio, Artist, Review…)
      dtos/              # Request/response DTOs
    pipes/               # local-time, phone-number
    utils/
      PaginatedComponent.ts  # Base class for paginated list components
```

### Routing

Three lazy-loaded route groups, each with routes **co-located** inside its feature folder:

| Path | File | Guard |
|---|---|---|
| `/` | `features/studio/studio.routes.ts` | `loginGuard` on login/register |
| `/user` | `features/user/user.routes.ts` | `userGuard` |
| `/admin` | `features/owner-studio/owner-studio.routes.ts` | `userGuard` with `expectedRoles: ['admin']` |

All routes use `loadComponent` (standalone components, no NgModules).

### Auth flow

- `TokenService` (`core/services/`) stores JWT in `localStorage` (`authToken`) and user profile (`userProfile`).
- Exposes Angular **Signals**: `isLogged` and `isAdmin` (read-only).
- `studioInterceptorFn` (`core/interceptors/`) automatically attaches `Authorization: Bearer <token>` to every outgoing HTTP request when a token exists.
- Admin role is determined by decoding the JWT payload and checking for `ROLE_ADMIN` in the `roles` claim.
- Guards read `tokenService.isLogged()` / `tokenService.isAdmin()` — both are signals.

### Pagination pattern

Components that display paginated lists extend `PaginatedComponent` (`shared/utils/PaginatedComponent.ts`), which manages `page`, `size`, and `total`. API responses use the generic `PageResponse<T>` interface (mirrors Spring `Page<T>`).

### Path alias

`@environments/*` maps to `src/environments/*` (configured in `tsconfig.json`). Always use `import { environment } from '@environments/environment'` in services.

### UI libraries

- **PrimeNG** (Aura theme) — primary component library.
- **Angular Material CDK** — used for dialogs (`MatDialog`).
- **Tailwind CSS 4** — utility classes in templates.
- **Swiper** — carousels/galleries.
- **@angular/google-maps** — studio location maps.
- **FontAwesome 7** — icons.

### SSR considerations

`TokenService` guards all `localStorage` access with `isPlatformBrowser(platformId)` to avoid SSR crashes. Any new service that accesses browser-only APIs must follow the same pattern.
