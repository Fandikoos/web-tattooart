import { Routes } from "@angular/router"

export default [
    {
        path: '',
        loadComponent: () => import('../features/studio/studio-list/studio-list.component').then(c => c.StudioListComponent)
    },
    {
        path: 'studio/:id',
        loadComponent: () => import('../features/studio/studio-detail/studio-detail.component').then(c => c.StudioDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('../features/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('../features/auth/register/register.component').then(c => c.RegisterComponent)
    },

] as Routes