import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/user.guard';

export default [
    {
        path: 'profile',
        loadComponent: () => import('./user-profile/user-profile.component').then(c => c.UserProfileComponent),
        canActivate: [userGuard], data: { expectedRoles: ['user'] },
    },

] as Routes;
