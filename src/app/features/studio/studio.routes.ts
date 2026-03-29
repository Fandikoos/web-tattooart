import { Routes } from "@angular/router"
import { loginGuard } from "../../core/guards/login.guard"

export default [
    {
        path: '',
        loadComponent: () => import('./studio-list/studio-list.component').then(c => c.StudioListComponent)
    },
    {
        path: 'studio/:id',
        loadComponent: () => import('./studio-detail/studio-detail.component').then(c => c.StudioDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('../auth/login/login.component').then(c => c.LoginComponent),
        canActivate: [ loginGuard ],
    },
    {
        path: 'register',
        loadComponent: () => import('../auth/register/register.component').then(c => c.RegisterComponent),
        canActivate: [ loginGuard ],
    },

] as Routes
