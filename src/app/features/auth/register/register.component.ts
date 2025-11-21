import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CreateUserDto } from '../../../shared/models/dtos/CreateUserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports:[
    FormsModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  username!: string;
  password!: string;
  email!: string;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }

  onRegister(): void{
    const dto = new CreateUserDto(this.username, this.email ,this.password);
    this.authService.register(dto).subscribe(
      data => {
        console.log(data)
        this.router.navigate(['/login'])
      }
    )
  }

}
