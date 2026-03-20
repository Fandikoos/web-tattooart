import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginUserDto } from '../models/dtos/LoginUserDto';
import { Observable } from 'rxjs';
import { JwtTokenDto } from '../models/dtos/JwtTokenDto';
import { CreateUserDto } from '../models/dtos/CreateUserDto';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpClient = inject(HttpClient);
  private urlAuth = environment.apiUrlAuth;

  public login(dto: LoginUserDto): Observable<JwtTokenDto> {
    return this.httpClient.post<JwtTokenDto>(`${this.urlAuth}/login`, dto);
  }

    public register(dto: CreateUserDto): Observable<any> {
    return this.httpClient.post<any>(`${this.urlAuth}/createUser`, dto);
  }

  public getUsernameByIdUser(idUser: number): Observable<string>{
    return this.httpClient.get<string>(`${this.urlAuth}/${idUser}`);  
 }
}
