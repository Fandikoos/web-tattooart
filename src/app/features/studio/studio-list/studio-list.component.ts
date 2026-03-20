import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { StudioService } from '../../../core/services/studio.service';
import { RouterLink } from '@angular/router';
import { FilterComponent } from "../filter/filter.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Studio } from '../../../shared/models/interfaces/Studio';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { TokenService } from '../../../core/services/token.service';
import { FavStudioService } from '../../../core/services/fav-studio.service';
import { FavouriteDto } from '../../../shared/models/dtos/FavouriteDto';
import { NgClass } from '@angular/common';
import { Favourite } from '../../../shared/models/interfaces/Favourite';
import { PaginatedComponent } from '../../../shared/utils/PaginatedComponent';
import { Filter } from '../../../shared/models/dtos/Filter';
import { studioInterceptorFn } from '../../../core/interceptors/studio.interceptor';
import { ReactiveFormsModule } from '@angular/forms';


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
  ],
  // No usamos ZoneJs en este componente para mejorar el rendimiento, por lo que Angular no detecta cambios automáticamente. Con esta estrategia, Angular solo se actualiza cuando las señales cambian, lo que optimiza el rendimiento
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioListComponent extends PaginatedComponent implements OnInit {

  private studioService = inject(StudioService);
  private tokenService = inject(TokenService);
  private favouriteService = inject(FavStudioService);
  private nameFilterSignal = signal('');
  private minRatingFilterSignal = signal(0);
  private maxRatingFilterSignal = signal(5);

  token = this.tokenService.isLogged();

  // Señal para recibir los estudios paginados
  studios = signal<Studio[]>([]);

  onFilterChange(filter: Filter) {
    // Desestructuración objetos ejemplo, sería mejor mandar un DTO con los filtros al backend y que este haga el filtrado, por ver un ejemplo lo hacemos así en el frontend
    const { name, minRating, maxRating } = filter;
    this.nameFilterSignal.set(name);
    this.minRatingFilterSignal.set(minRating);
    this.maxRatingFilterSignal.set(maxRating);
    this.loadStudios(name, minRating, maxRating);

  }

  onPageChange($event: PageEvent) {
    this.setPage($event.pageIndex);
    this.setSize($event.pageSize);
    this.loadStudios(this.nameFilterSignal(), this.minRatingFilterSignal(), this.maxRatingFilterSignal());
  }

  ngOnInit() {
    this.loadStudios(this.nameFilterSignal(), this.minRatingFilterSignal(), this.maxRatingFilterSignal());
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

  private loadStudios(name: string, minRating: number, maxRating: number) {
    this.studioService.findByFilters(this.getPage(), this.getSize(), 'idStudio', name, minRating, maxRating).subscribe((pageResponse) => {
      this.setTotal(pageResponse.totalElements);
      const studios = pageResponse.content;

      if (this.token) {
        const idUser = this.tokenService.getProfileUserDto()!.idUser;

        this.favouriteService.getFavByIdUser(idUser).subscribe((favs) => {
          this.studios.set(this.favStudiosByUser(studios, favs));
        });
      } else {
        this.studios.set(studios);
      }
    });
  }

}
