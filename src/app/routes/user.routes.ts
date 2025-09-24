import { Routes } from '@angular/router';
import { userGuard } from '../shared/guards/user.guard';

export default [
    {
        path: 'profile',
        loadComponent: () => import('../features/user/user-profile/user-profile.component').then(c => c.UserProfileComponent),
        canActivate: [userGuard], data: { expectedRoles: ['user'] },
    },

] as Routes;