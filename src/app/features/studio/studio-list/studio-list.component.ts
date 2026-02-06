import { Component, inject, OnInit, signal } from '@angular/core';
import { StudioService } from '../../../shared/services/studio.service';
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
    // PaginatorComponent,
    NgClass
  ]
})
export class StudioListComponent implements OnInit {

  private studioService = inject(StudioService);
  private tokenService = inject(TokenService);
  private favouriteService = inject(FavStudioService);

  page = 0;
  size = 10;
  total = 0;

  token = this.tokenService.isLogged();

  // Señal para recibir los estudios paginados
  studios = signal<Studio[]>([]);

  onPaginatedStudiosChange(studios: Studio[]) {
    // Se reciben los estudios ya paginados
    this.studios.set(studios);
  }

  onFilterChange(name: string) {
    if (name.length > 0) {
      this.studioService.findByName(name).subscribe((studios: Studio[]) => {
        if (this.token) {
          const idUser = this.tokenService.getProfileUserDto()!.idUser;
          this.favouriteService.getFavByIdUser(idUser).subscribe((favs: Favourite[]) => {
            this.studios.set(this.favStudiosByUser(studios, favs));
          });
        } else {
          this.studios.set(studios)
        }
      })
    } else {
      this.page = 0;
      this.ngOnInit();
    }
  }

  ngOnInit() {
    if (this.token) {
      const idUser = this.tokenService.getProfileUserDto()!.idUser;
      this.studioService.getAll(this.page, this.size).subscribe((pageResponse) => {
        this.total = pageResponse.totalElements;
        const studios = pageResponse.content;

        this.favouriteService.getFavByIdUser(idUser).subscribe((favs: Favourite[]) => {
          this.studios.set(this.favStudiosByUser(studios, favs));
        });
      });
    } else {
      this.studioService.getAll(this.page, this.size).subscribe((pageResponse) => {
        this.total = pageResponse.totalElements;
        this.studios.set(pageResponse.content);
      });
    }
  }

  toggleFav(studio: Studio) {
    const idUser = this.tokenService.getProfileUserDto()!.idUser;
    const idStudio = studio.idStudio;
    if (!studio.isFav) {
      const favDto = new FavouriteDto(idUser, idStudio!);
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

  private favStudiosByUser(studios: Studio[], favs: Favourite[]): Studio[] {
    const favMap = new Map(favs.map(f => [f.idStudio, f]));
    return studios.map(studio => {
      const fav = favMap.get(studio.idStudio!);
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
