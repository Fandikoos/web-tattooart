import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { RouterLink } from "@angular/router";
import { AdminStudiosListComponent } from '../admin-studios-list/admin-studios-list.component';
import { OwnerStudioComponent } from '../owner-studio.component';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.css'],
  imports: [RouterLink]
})
export class LateralMenuComponent implements OnInit {

  private tokenService = inject(TokenService);
  nameAdminUser: string | undefined;

  ngOnInit() {
    this.nameAdminUser = this.tokenService.getProfileUserDto()?.username;
  }

}
