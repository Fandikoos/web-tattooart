import { Routes } from "@angular/router"

export default [
    {
        path: '',
        loadComponent: () => import('../features/studio/studio-list/studio-list.component').then(c => c.StudioListComponent)
    }
] as Routes