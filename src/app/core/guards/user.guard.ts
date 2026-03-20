import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const userGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Obtenemos los roles esperados de la configuración de la ruta
  const expectedRoles = route.data['expectedRoles'];
  // Determinar el rol del usuario
  const rol = tokenService.isAdmin() ? 'admin' : 'user';

  // Si no esta logeado o el rol no está incluido el los roles permitidos de la ruta
  if(!tokenService.isLogged() || !expectedRoles.includes(rol)){
    router.navigate(['/']);
    return false;
  }

  return true;
};
