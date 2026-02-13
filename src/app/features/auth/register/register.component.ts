import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CreateUserDto } from '../../../shared/models/dtos/CreateUserDto';
import { Router } from '@angular/router';
import { Exception } from '../../../core/exceptions/exceptions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends Exception implements OnInit {

  username!: string;
  password!: string;
  email!: string;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onRegister(form: NgForm): void {
    if (form.invalid) return;

    this.backendErrors = {};
    this.isLoading = true;

    const dto = new CreateUserDto(this.username, this.email, this.password);
    this.authService.register(dto).subscribe({
      next: () => {
        this.isLoading = false;
        form.resetForm();
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.isLoading = false;
        this.handleBackendErrors(err);
      }
    })
  }

}
