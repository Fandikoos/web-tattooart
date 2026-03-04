import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports:[
    RouterLink,
    RouterLinkActive,
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public tokenService = inject(TokenService);
  private router = inject(Router)

  logout() {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }

}
