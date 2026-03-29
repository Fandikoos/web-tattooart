# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Perfil del desarrollador

El desarrollador es **junior y está aprendiendo**. Por ello, Claude debe:

- Hacer **sugerencias proactivas** de mejora aunque no se pidan explícitamente (código más limpio, mejor estructura, etc.)
- Señalar **buenas prácticas** de Angular, TypeScript y desarrollo web en general cuando sean relevantes
- Explicar brevemente el **porqué** de las decisiones técnicas al implementar algo
- Avisar si se detecta **código que puede mejorarse** en los archivos que se lean o modifiquen (duplicación, naming confuso, lógica compleja sin comentar, etc.)
- Indicar cuando algo podría causar **problemas de rendimiento, accesibilidad o seguridad**
- Mantener las explicaciones **concisas** — no hace falta ser exhaustivo, con un apunte corto es suficiente

## Comandos

```bash
# Servidor de desarrollo
npm start                    # ng serve → http://localhost:4200

# Construcción
npm run build                # build de producción
npm run watch                # build de desarrollo con modo watch

# Tests
npm test                     # ejecutar todos los tests con Karma
# Ejecutar un archivo de test específico (ejemplo):
npx ng test --include='src/app/features/studio/**/*.spec.ts'

# SSR (después de build)
npm run serve:ssr:tattooart
```

## Arquitectura

SPA Angular 19 con SSR (`@angular/ssr`). La app conecta con un backend Spring Boot en `localhost:8080/tattooart/v1/`.

### Estructura de módulos

```
src/app/
  app.routes.ts          # Rutas lazy raíz (3 grupos de rutas)
  core/
    services/            # Servicios singleton: uno por entidad (wrappers de HttpClient)
    guards/              # login.guard, user.guard
    interceptors/        # studio.interceptor (inyección JWT Bearer)
    layout/
      header/            # Cabecera de la app con navegación y logout
      footer/            # Pie de página
    exceptions/          # Clase base Exception usada por login/register
  features/              # Componentes de página agrupados por dominio
    auth/                # login, register
    studio/
      studio.routes.ts   # Definiciones de rutas co-localizadas con la feature
      studio-list/       # Listado público con filtros y favoritos
      studio-detail/     # Vista detalle con galería, reseñas, artistas
      filter/            # Sub-componente de filtros
    artist/              # artist-detail (usado como sub-componente en studio-detail)
    owner-studio/
      owner-studio.routes.ts
      admin-studios-list/  # CRUD estudios
      admin-artists-list/  # CRUD artistas
      lateral-menu/
    user/
      user.routes.ts
      user-profile/      # Gestión de favoritos
  shared/
    components/          # Componentes UI reutilizables
      gallery/           # mat-dialog-gallery (carrusel Swiper)
      review/            # mat-dialog-reviews, mat-dialog-create-review
      google-maps/       # Wrapper GoogleMapsComponent
      paginator/         # PaginatorComponent (wrapper de Material paginator)
    models/
      interfaces/        # Interfaces TypeScript (Studio, Artist, Review…)
      dtos/              # DTOs de request/response
    pipes/               # local-time, phone-number
    utils/
      PaginatedComponent.ts  # Clase base para componentes de lista paginada
```

### Rutas

Tres grupos de rutas lazy-loaded, cada uno con rutas **co-localizadas** dentro de su carpeta de feature:

| Ruta | Archivo | Guard |
|---|---|---|
| `/` | `features/studio/studio.routes.ts` | `loginGuard` en login/register |
| `/user` | `features/user/user.routes.ts` | `userGuard` |
| `/admin` | `features/owner-studio/owner-studio.routes.ts` | `userGuard` con `expectedRoles: ['admin']` |

Todas las rutas usan `loadComponent` (componentes standalone, sin NgModules).

### Flujo de autenticación

- `TokenService` (`core/services/`) almacena el JWT en `localStorage` (`authToken`) y el perfil de usuario (`userProfile`).
- Expone **Signals** de Angular: `isLogged` e `isAdmin` (solo lectura).
- Expone `getUserId()` para extraer el ID de usuario del perfil almacenado.
- `studioInterceptorFn` (`core/interceptors/`) adjunta automáticamente `Authorization: Bearer <token>` a cada petición HTTP saliente cuando existe un token. Usa sintaxis funcional (`HttpInterceptorFn`) con `inject()`.
- El rol de administrador se determina decodificando el payload JWT y comprobando `ROLE_ADMIN` en el claim `roles`.
- Los guards leen `tokenService.isLogged()` / `tokenService.isAdmin()` — ambos son signals.
- **`loginGuard`**: redirige a `/` si el usuario ya está autenticado.
- **`userGuard`**: comprueba `route.data['expectedRoles']` para control de acceso basado en roles.

### Manejo de excepciones

- Clase `Exception` en `core/exceptions/exceptions.ts`, usada por login y registro.
- Mapea respuestas del backend a mensajes de error en español:
  - **409** → duplicidad de nombre de usuario o email.
  - **401** → credenciales inválidas.

### Configuración de entornos

`src/environments/` contiene dos archivos:
- `environment.ts` — producción
- `environment.development.ts` — desarrollo

Ambos exponen las mismas 8 URLs de la API (todas apuntan a `localhost:8080/tattooart/v1/`):

| Variable | Endpoint |
|---|---|
| `apiUrlArtist` | `/artist` |
| `apiUrlPortfolioArtist` | `/portfolio-artist` |
| `apiUrlStudio` | `/studio` |
| `apiUrlStudioImage` | `/studio-image` |
| `apiUrlAuth` | `/auth` |
| `apiUrlFav` | `/fav` |
| `apiUrlImage` | `/image` |
| `apiUrlReview` | `/review` |

Siempre usar `import { environment } from '@environments/environment'` en los servicios.

### Patrón de paginación

Los componentes que muestran listas paginadas extienden `PaginatedComponent` (`shared/utils/PaginatedComponent.ts`), que gestiona `page`, `size` y `total`. Las respuestas de la API usan la interfaz genérica `PageResponse<T>` (equivale a `Page<T>` de Spring).

### Alias de rutas

`@environments/*` mapea a `src/environments/*` (configurado en `tsconfig.json`).

### Pipes

| Pipe | Selector | Función |
|---|---|---|
| `LocalTimePipe` | `local-time` | Elimina los segundos de cadenas de tiempo (HH:mm:ss → HH:mm) |
| `PhonePipe` | `phone` | Formatea números de teléfono con prefijo `+34` y grupos separados por espacios |

### Servicios destacados

- **`AuthService`**: incluye `getUsernameByIdUser(idUser)` para obtener el nombre de usuario por ID.
- **`StudioService`**: incluye `findByIdsStudios(idsStudios[])` para obtener estudios en batch por array de IDs.
- **`TokenService`**: gestión completa de JWT y perfil de usuario.

### Bibliotecas UI

- **PrimeNG** (tema Aura) — biblioteca de componentes principal.
- **Angular Material CDK** — usado para diálogos (`MatDialog`). Tema precompilado `cyan-orange.css`.
- **Tailwind CSS 4** — clases utilitarias en plantillas. Configurado con `@tailwindcss/postcss` en `.postcssrc.json`.
- **Swiper** — carruseles/galerías.
- **@angular/google-maps** — mapas de localización de estudios.
- **FontAwesome 7** — iconos (cargado desde CDN en `angular.json`).

### SSR y configuración del servidor

- Punto de entrada SSR: `src/server.ts` (Express.js con `CommonEngine`).
- Puerto configurable mediante variable de entorno `PORT` (por defecto `4000`).
- Archivos estáticos servidos con caché de 1 año (`max-age`).
- Hidratación del cliente con `provideClientHydration(withEventReplay())` para mejor rendimiento en SSR.
- Pre-rendering habilitado (`prerender: true` en `angular.json`).
- Todo servicio que acceda a APIs exclusivas del navegador debe usar `isPlatformBrowser(platformId)` para evitar errores en SSR.

### Configuración de build

- **Budgets de producción**: advertencia en 500 kB de carga inicial, error en 1 MB; advertencia en estilos por componente en 4 kB, error en 8 kB.
- **Hashing de salida**: hash completo en producción.
- **TypeScript**: modo estricto habilitado (`strict`, `strictTemplates`, `strictInjectionParameters`, `strictInputAccessors`).

### Configuración de la aplicación

`src/app/app.config.ts` configura:
- Detección de cambios optimizada: `eventCoalescing: true`.
- Transiciones de vista del router habilitadas.
- `withFetch()` para usar la API Fetch nativa en lugar de XMLHttpRequest.
