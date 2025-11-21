import { Routes } from '@angular/router';
import { userGuard } from '../shared/guards/user.guard';

export default [
    {
        path: 'dashboard',
        loadComponent: () => import('../features/owner-studio/admin-studio.component').then(c => c.OwnerStudioComponent),
        canActivate: [userGuard], data: { expectedRoles: ['admin'] },
    },

] as Routes;