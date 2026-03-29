import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterComponent } from "./core/layout/footer/footer.component";
import { HeaderComponent } from "./core/layout/header/header.component";
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    FooterComponent,
    HeaderComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tattooart';
  private tokenService = inject(TokenService);

  ngOnInit(): void {
    // this.tokenService.logout();
  }
}
