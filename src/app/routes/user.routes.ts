import { Routes } from '@angular/router';

export default [
    {
        path: 'profile',
        loadComponent: () => import('../features/user/user-profile/user-profile.component').then(c => c.UserProfileComponent)
    },

] as Routes;