import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { Studio } from '../models/interfaces/Studio';

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

  findByName(studioName: string): Observable<Studio[]>{
    if(!studioName || studioName.trim().length < 2){
      return of([]);
    }
    const params = new HttpParams().set('name', studioName.trim());
    return this.httpClient.get<Studio[]>(`${this.urlApiStudio}/search`, { params });
  }

  findByIdsStudios(idsStudios: number[]): Observable<Studio[]>{
    return this.httpClient.get<Studio[]>(`${this.urlApiStudio}/byIdsStudios?`, {
      // Unir por comas los diferentes idsStudios sino peta la petición
      params: { idsStudios: idsStudios.join(',') }
    });
  }

}
