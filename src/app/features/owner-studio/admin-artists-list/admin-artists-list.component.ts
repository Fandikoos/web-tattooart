import { Component, inject, signal } from '@angular/core';
import { ArtistService } from '../../../shared/services/artist.service';
import { Artist } from '../../../shared/models/interfaces/Artist';
import { TokenService } from '../../../shared/services/token.service';

@Component({
  selector: 'app-admin-artists-list',
  imports: [],
  templateUrl: './admin-artists-list.component.html',
  styleUrl: './admin-artists-list.component.css'
})
export class AdminArtistsListComponent {
deleteArtist(arg0: any) {
throw new Error('Method not implemented.');
}
prepareEditArtist(_t13: Artist) {
throw new Error('Method not implemented.');
}

  private artistService = inject(ArtistService);
  private tokenService = inject(TokenService);
  artists = signal<Artist[]>([]);
  editArtist: boolean = false;

  
ngOnInit() {
  const idAdmin = this.tokenService.getProfileUserDto()?.idUser;
  if (idAdmin != null) {
    this.artistService.getArtistByIdUser(idAdmin).subscribe(data => {
      console.log(data);
      this.artists.set(data);
    })
  }
}

  prepareAddArtist() {
    throw new Error('Method not implemented.');
  }

}
