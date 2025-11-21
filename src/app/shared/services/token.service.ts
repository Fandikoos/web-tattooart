import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ProfileUserDto } from '../models/interfaces/ProfileUserDto';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userProfile';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Signal para el estado de autenticación
  private _isLogged = signal<boolean>(false);
  private _isAdmin = signal<boolean>(false);

  // Signal públicas solamente de lectura para mostrar o no según que componentes
  public isLogged = this._isLogged.asReadonly();
  public isAdmin = this._isAdmin.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeAuthState();
  }

  initializeAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      this._isLogged.set(token !== null);

      if (token) {
        this.checkAdminRole(token);
      }
    }
  }

  public setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
      this._isLogged.set(true);
      // Verificamos si es admin
      this.checkAdminRole(token);
    }
  }

  getUserId(): number {
    const userProfile = this.getProfileUserDto();
    if (userProfile != null) {
      return userProfile.idUser;
    } else {
      return -1;
    }
  }

  public setUserProfile(userProfile: ProfileUserDto): void {
    if (isPlatformBrowser(this.platformId) && userProfile) {
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
    }
  }

  public getProfileUserDto(): ProfileUserDto | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      this._isLogged.set(false);
      this._isAdmin.set(false);
    }
  }

  checkAdminRole(token: string) {
    try {
      const payload = token.split(".")[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const roles = values.roles;
      this._isAdmin.set(roles.includes("ROLE_ADMIN"));
    } catch (e) {
      console.error('Error decoding token', e);
      this._isAdmin.set(false);
    }
  }
}
