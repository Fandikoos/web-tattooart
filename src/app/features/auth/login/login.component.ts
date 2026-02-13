import { Component, inject, INJECTOR, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { TokenService } from '../../../shared/services/token.service';
import { Router, RouterLink } from '@angular/router';
import { LoginUserDto } from '../../../shared/models/dtos/LoginUserDto';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subscribable } from 'rxjs';
import { JwtTokenDto } from '../../../shared/models/dtos/JwtTokenDto';
import { Exception } from '../../../core/exceptions/exceptions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends Exception implements OnInit{

  username!: string;
  password!: string;
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onLogin() {
    const dto = new LoginUserDto(this.username, this.password);
    this.authService.login(dto).subscribe({
      next: (data: JwtTokenDto) => {
        this.tokenService.setToken(data.token);
        this.tokenService.setUserProfile(data.userProfile);
        if(!this.tokenService.isAdmin){
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.handleBackendErrors(err);
      }
    })
  }

}
