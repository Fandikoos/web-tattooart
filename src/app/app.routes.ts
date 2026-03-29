import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/studio/studio.routes'),
    },
    {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes'),
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/owner-studio/owner-studio.routes')
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    }
];
