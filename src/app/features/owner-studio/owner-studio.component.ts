import { Component, inject, OnInit } from '@angular/core';
import { LateralMenuComponent } from "./lateral-menu/lateral-menu.component";
import { AdminStudiosListComponent } from "./admin-studios-list/admin-studios-list.component";
import { IsActiveMatchOptions, Router, RouterOutlet } from '@angular/router';
import { AdminArtistsListComponent } from "./admin-artists-list/admin-artists-list.component";

@Component({
  selector: 'app-admin-studio',
  templateUrl: './owner-studio.component.html',
  imports: [
    LateralMenuComponent,
    RouterOutlet
] 
})
export class OwnerStudioComponent implements OnInit {

  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }

  isAdminStudiosTabActive(): boolean {
    const options: IsActiveMatchOptions = {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    return this.router.isActive('/admin/studios', options);
  }

    isAdminArtistsTabActive(): boolean {
    const options: IsActiveMatchOptions = {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    return this.router.isActive('/admin/artists', options);
  }

}
