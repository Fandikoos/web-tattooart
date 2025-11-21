import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Artist } from '../models/interfaces/Artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private httpClient = inject(HttpClient);
  private urlApiArtist = environment.apiUrlArtist;

  getArtistByIdStudio(idStudio: number): Observable<Artist[]>{
      return this.httpClient.get<Artist[]>(`${this.urlApiArtist}/studio/${idStudio}`);
  }

}
