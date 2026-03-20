import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/user.guard';

export default [
    {
        path: '',
        loadComponent: () => import('./owner-studio.component').then(c => c.OwnerStudioComponent),
        canActivate: [userGuard],
        data: { expectedRoles: ['admin'] },
        children: [
            {
                path: 'artists',
                loadComponent: () => import('./admin-artists-list/admin-artists-list.component').then(c => c.AdminArtistsListComponent),
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./admin-studios-list/admin-studios-list.component').then(c => c.AdminStudiosListComponent),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    }
] as Routes;
