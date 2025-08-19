import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./routes/studio.routes'),
    },
    {
        path: 'user',
        loadChildren: () => import('./routes/user.routes'),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    }
];
