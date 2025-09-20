import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Favourite } from '../models/interfaces/Favourite';
import { Observable } from 'rxjs';
import { FavouriteDto } from '../models/dtos/FavouriteDto';

@Injectable({
  providedIn: 'root'
})
export class FavStudioService {

  private httpClient = inject(HttpClient);
  private urlFav = environment.apiUrlFav;

  addFav(favDto: FavouriteDto): Observable<Favourite>{
    return this.httpClient.post<Favourite>(this.urlFav, favDto);
  }

  getFavByIdUser(idUser: number): Observable<Favourite[]>{
    return this.httpClient.get<Favourite[]>(`${this.urlFav}/user/${idUser}`);
  }

  deleteFav(idFav: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.urlFav}/${idFav}`);
  }

}
