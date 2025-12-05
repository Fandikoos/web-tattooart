import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../models/interfaces/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private httpClient = inject(HttpClient);
  private urlApiImage = environment.apiUrlImage;

  constructor() { }

  getImagesByIdStudio(idStudio: number): Observable<Image[]> {
    return this.httpClient.get<Image[]>(`${this.urlApiImage}/${idStudio}/images`);
  }

  upload(idStudio: number, file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file)
    return this.httpClient.post<Image>(`${this.urlApiImage}/${idStudio}/images/upload`, formData);
  }

  deleteImage(idStudio: number, idImage: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlApiImage}/${idStudio}/images/${idImage}`);
  }

}
