import { Component, inject, INJECTOR, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { TokenService } from '../../../shared/services/token.service';
import { Router, RouterLink } from '@angular/router';
import { LoginUserDto } from '../../../shared/models/dtos/LoginUserDto';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subscribable } from 'rxjs';
import { JwtTokenDto } from '../../../shared/models/dtos/JwtTokenDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }

  onLogin() {
    const dto = new LoginUserDto(this.username, this.password);
    this.authService.login(dto).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.tokenService.setUserProfile(data.userProfile);
        this.router.navigate(['/']);
      }
    )
  }

}
