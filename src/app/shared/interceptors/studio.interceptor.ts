import type { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

const AUTH = 'Authorization';
const BEARER = 'Bearer ';

@Injectable()
export class StudioInterceptor implements HttpInterceptor{

  private tokenService = inject(TokenService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    let intReq = request;
    const token = this.tokenService.getToken();
    console.log("Interceptor: Token actual", this.tokenService.getToken()); // ← Verifica esto
    if(token != null){
      intReq = request.clone({headers: request.headers.set(AUTH, BEARER + token)});
    }
    return next.handle(intReq);
  }
  
}
