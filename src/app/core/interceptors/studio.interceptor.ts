import type { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

// Nombre estándar de la cabecera donde viaja el token
const AUTH = 'Authorization';
// Prefijo que espera Spring Security -> "Bearer <token>"
const BEARER = 'Bearer ';

// Interceptor funcional (Angular 16+)
// Se ejecuta ANTES de que la request salga de Angular
export const studioInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio de tokens (forma moderna sin constructor)
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Si tenemos un token en localStorage
  if (token) {
    // Clonamos la request original y le añadimos la cabecera Authorization
    const cloned = req.clone({
      setHeaders: { [AUTH]: BEARER + token }
    });
    // Enviamos la request clonada (ya con el token)
    return next(cloned);
  }

  // Si no hay token, enviamos la request tal cual
  return next(req);
};
