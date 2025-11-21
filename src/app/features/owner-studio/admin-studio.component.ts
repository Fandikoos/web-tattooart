import { Component, OnInit } from '@angular/core';
import { LateralMenuComponent } from "./lateral-menu/lateral-menu.component";
import { AdminStudiosListComponent } from "./admin-studios-list/admin-studios-list.component";

@Component({
  selector: 'app-admin-studio',
  templateUrl: './admin-studio.component.html',
  styleUrls: ['./admin-studio.component.css'],
  imports: [LateralMenuComponent, AdminStudiosListComponent]
})
export class OwnerStudioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
