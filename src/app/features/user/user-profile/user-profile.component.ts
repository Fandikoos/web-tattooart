import { Component, inject, OnInit, signal } from '@angular/core';
import { TokenService } from '../../../shared/services/token.service';
import { ProfileUserDto } from '../../../shared/models/interfaces/ProfileUserDto';
import { FavStudioService } from '../../../shared/services/fav-studio.service';
import { StudioService } from '../../../shared/services/studio.service';
import { Studio } from '../../../shared/models/interfaces/Studio';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private tokenService = inject(TokenService);
  private favouriteService = inject(FavStudioService);
  private studioService = inject(StudioService);
  userProfile = signal<ProfileUserDto | null>(null);
  favStudiosByUser = signal<Studio[]>([]);

  constructor() { }

  ngOnInit() {
    // Cargamos perfil de usuario
    this.userProfile.set(this.tokenService.getProfileUserDto());
    
    // Obtenemos sus estudios favoritos
    this.favouriteService.getFavByIdUser(this.userProfile()!.idUser).subscribe(favs => {
      // Recogemos los ids de los estudios
      const idStudiosFavOfUser = favs.map(fav => fav.idStudio);

      if(idStudiosFavOfUser.length > 0){
        this.studioService.findByIdsStudios(idStudiosFavOfUser).subscribe(studios => {
          this.favStudiosByUser.set(studios);
        })
      }
    })
  }

}
