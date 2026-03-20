import { Component, inject, OnInit, signal } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { ProfileUserDto } from '../../../shared/models/interfaces/ProfileUserDto';
import { FavStudioService } from '../../../core/services/fav-studio.service';
import { StudioService } from '../../../core/services/studio.service';
import { Studio } from '../../../shared/models/interfaces/Studio';
import { Router, RouterLink } from '@angular/router';
import { Favourite } from '../../../shared/models/interfaces/Favourite';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [RouterLink]
})
export class UserProfileComponent implements OnInit {

  private tokenService = inject(TokenService);
  private favouriteService = inject(FavStudioService);
  private studioService = inject(StudioService);
  private router = inject(Router);
  userProfile = signal<ProfileUserDto | null>(null);
  favStudiosByUser = signal<Studio[]>([]);
  favourites: Favourite[] | undefined;

  constructor() { }

  ngOnInit() {
    // Cargamos perfil de usuario
    this.userProfile.set(this.tokenService.getProfileUserDto());
    
    // Obtenemos sus estudios favoritos
    this.favouriteService.getFavByIdUser(this.userProfile()!.idUser).subscribe(favs => {
      // Recogemos los ids de los estudios
      const idStudiosFavOfUser = favs.map(fav => fav.idStudio);
      this.favourites = favs;

      if(idStudiosFavOfUser.length > 0){
        this.studioService.findByIdsStudios(idStudiosFavOfUser).subscribe(studios => {
          this.favStudiosByUser.set(studios);
        })
      }
    })
  }

  discardFav(studio: Studio) {
    // Si es null, undefined hace sale del método sin ejectuar nada mas
    if (!this.favourites) return;

    // .find recorre el array hasta encontrar el primer elemento que cumple la condición y te devuelve el objeto
    const fav = this.favourites.find(f => f.idStudio === studio.idStudio);
    if (!fav) return;

    this.favouriteService.deleteFav(fav.idFavourite).subscribe(() => {
      // Quitar de la lista reactiva
      this.favStudiosByUser.update(studios => 
        studios.filter(s => s.idStudio !== studio.idStudio)
      );
      studio.isFav = false;
      studio.idFavourite = null;

      // Lo eliminamos de la lista local de favoritos tambien
      this.favourites = this.favourites!.filter(f => f.idFavourite !== fav.idFavourite);
    });
  }


}
