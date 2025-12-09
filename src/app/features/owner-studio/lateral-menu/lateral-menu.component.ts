import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/services/token.service';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.css']
})
export class LateralMenuComponent implements OnInit {

  private tokenService = inject(TokenService);
  nameAdminUser: string | undefined;

  ngOnInit() {
    this.nameAdminUser = this.tokenService.getProfileUserDto()?.username;
  }

}
