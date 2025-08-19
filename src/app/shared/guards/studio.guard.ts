import type { CanActivateFn } from '@angular/router';

export const studioGuard: CanActivateFn = (route, state) => {
  return true;
};
