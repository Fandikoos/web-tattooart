import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { StudioService } from '../../../shared/services/studio.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FilterComponent } from "../filter/filter.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Studio } from '../../../shared/models/interfaces/Studio';
import { PaginatorComponent } from '../../../shared/utils/paginator/paginator.component';
import { TokenService } from '../../../shared/services/token.service';
import { FavStudioService } from '../../../shared/services/fav-studio.service';
import { FavouriteDto } from '../../../shared/models/dtos/FavouriteDto';
import { NgClass } from '@angular/common';
import { Favourite } from '../../../shared/models/interfaces/Favourite';


@Component({
  selector: 'app-studio-list',
  templateUrl: './studio-list.component.html',
  styleUrls: ['./studio-list.component.css'],
  imports: [
    RouterLink,
    FilterComponent,
    MatPaginatorModule,
    PaginatorComponent,
    NgClass
]
})
export class StudioListComponent implements OnInit {

  private studioService = inject(StudioService);
  private tokenService = inject(TokenService);
  private favouriteService = inject(FavStudioService);

  private studios$ = this.studioService.getAll();
  public studios = toSignal(this.studios$);
  token = this.tokenService.isLogged();
  
  // Señal para recibir los estudios paginados
  paginatedStudios = signal<Studio[]>([]);

  onPaginatedStudiosChange(studios: Studio[]){
    // Se reciben los estudios ya paginados
    this.paginatedStudios.set(studios);
  }

  onFilterChange(name: string){
    if(name.length > 0){
      this.studioService.findByName(name).subscribe((studios: Studio[]) => {
        if(this.token){
          const idUser = this.tokenService.getProfileUserDto()!.idUser;
          this.favouriteService.getFavByIdUser(idUser).subscribe((favs: Favourite[]) => {
            this.paginatedStudios.set(this.favStudiosByUser(studios, favs));
          });
        } else {
          this.paginatedStudios.set(studios)
        }
      })
    } else {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    if(this.token){
      const idUser = this.tokenService.getProfileUserDto()!.idUser;
      this.studioService.getAll().subscribe((studios: Studio[]) => {
        
        this.favouriteService.getFavByIdUser(idUser).subscribe((favs: Favourite[]) => {
          this.paginatedStudios.set(this.favStudiosByUser(studios, favs));
        });
      });
    } else {
      this.studioService.getAll().subscribe((studios: Studio[]) => this.paginatedStudios.set(studios));
    }
  }

  toggleFav(studio: Studio) {
    const idUser = this.tokenService.getProfileUserDto()!.idUser;
    const idStudio = studio.idStudio;
    if(!studio.isFav){
      const favDto = new FavouriteDto(idUser, idStudio);
      this.favouriteService.addFav(favDto).subscribe((saved: Favourite) => {
        studio.isFav = true;
        studio.idFavourite = saved.idFavourite;
      });
    } else {
      this.favouriteService.deleteFav(studio.idFavourite).subscribe(() => {
        studio.isFav = false;
        studio.idFavourite = null;
      })
    }
  }

  private favStudiosByUser(studios: Studio[], favs: Favourite[]): Studio[]{
    const favMap = new Map(favs.map(f => [f.idStudio, f]));
    return studios.map(studio => {
      const fav = favMap.get(studio.idStudio);
      return {
        // Esto copia todas las propiedades que ya tiene el objeto Studio
        ...studio,
        // Las propiedades restantes, que no estan en el backend
        isFav: fav ? true : false,
        idFavourite: fav ? fav.idFavourite : null
      };
    });
  }

}
