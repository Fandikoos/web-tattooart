import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Studio } from '../models/interfaces/Studio';
import { PageResponse } from '../models/interfaces/PageResponse';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudioService {

  private httpClient = inject(HttpClient);
  private urlApiStudio = environment.apiUrlStudio;

  getAll(page: number, size: number, sort: string = 'idStudio'): Observable<PageResponse<Studio>> {
    return this.httpClient.get<PageResponse<Studio>>(this.urlApiStudio, {
      params: {
        page,
        size,
        sort
      }
    });
  }

  getById(idStudio: number): Observable<Studio> {
    return this.httpClient.get<Studio>(`${this.urlApiStudio}/${idStudio}`)
  }

  findByFilters(page: number, size: number, sort: string = 'idStudio', name: string, minRating: number, maxRating: number): Observable<PageResponse<Studio>> {
    return this.httpClient.get<PageResponse<Studio>>(`${this.urlApiStudio}/search`, {
      params: {
        page,
        size,
        sort,
        name,
        minRating,
        maxRating
      }
    });
    
  }

  findByIdsStudios(idsStudios: number[]): Observable<Studio[]> {
    return this.httpClient.get<Studio[]>(`${this.urlApiStudio}/byIdsStudios?`, {
      // Unir por comas los diferentes idsStudios sino peta la petición
      params: { idsStudios: idsStudios.join(',') }
    });
  }

  findByIdAdmin(idAdmin: number): Observable<Studio[]> {
    return this.httpClient.get<Studio[]>(`${this.urlApiStudio}/studios/${idAdmin}`);
  }

  update(idStudio: number, studio: Studio): Observable<void> {
    return this.httpClient.put<void>(`${this.urlApiStudio}/update/${idStudio}`, studio);
  }

  delete(idStudio: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlApiStudio}/${idStudio}`);
  }

  create(studio: Studio): Observable<Studio> {
    return this.httpClient.post<Studio>(this.urlApiStudio, studio);
  }

}
