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

  getArtistByIdStudio(idStudio: number): Observable<Artist[]> {
    return this.httpClient.get<Artist[]>(`${this.urlApiArtist}/studio/${idStudio}`);
  }

  getArtistByIdUser(idUser: number): Observable<Artist[]> {
    return this.httpClient.get<Artist[]>(`${this.urlApiArtist}/artists/${idUser}`);
  }

  deleteArtist(idArtist: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlApiArtist}/${idArtist}`);
  }

  updateArtist(idArtist: number, artist: Artist): Observable<void> {
    return this.httpClient.put<void>(`${this.urlApiArtist}/${idArtist}`, artist);
  }

  createArtist(artist: Artist): Observable<Artist> {
    return this.httpClient.post<Artist>(`${this.urlApiArtist}`, artist);
  }
}
