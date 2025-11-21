import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { studioInterceptorFn } from './shared/interceptors/studio.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()), 
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),

    // Aquí se registran los interceptores
    provideHttpClient(
      withFetch(),
      withInterceptors([studioInterceptorFn]) // 👈 función interceptor
    ),
  ]
};
