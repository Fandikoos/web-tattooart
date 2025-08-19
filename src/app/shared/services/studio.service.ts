import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Studio } from '../models/Studio';

@Injectable({
  providedIn: 'root'
})
export class StudioService {

  private httpClient = inject(HttpClient);
  private urlApiStudio = environment.apiUrlStudio;

  getAll(): Observable<Studio[]>{
    return this.httpClient.get<Studio[]>(this.urlApiStudio);
  }

  getById(idStudio: number): Observable<Studio>{
    return this.httpClient.get<Studio>(`${this.urlApiStudio}/${idStudio}`)
  }


}
