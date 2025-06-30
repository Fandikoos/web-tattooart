import { Routes } from "@angular/router"

export default [
    {
        path: '',
        loadComponent: () => import('../features/studio/studio-list/studio-list.component').then(c => c.StudioListComponent)
    },
    {
        path: 'studio/:id',
        loadComponent: () => import('../features/studio/studio-detail/studio-detail.component').then(c => c.StudioDetailComponent)
    }

] as Routes