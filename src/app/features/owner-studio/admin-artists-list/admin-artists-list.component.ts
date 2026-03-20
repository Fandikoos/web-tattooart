import { Component, inject, signal } from '@angular/core';
import { ArtistService } from '../../../core/services/artist.service';
import { Artist } from '../../../shared/models/interfaces/Artist';
import { TokenService } from '../../../core/services/token.service';
import { AdminArtistEditComponent } from "./admin-artist-edit/admin-artist-edit.component";

@Component({
  selector: 'app-admin-artists-list',
  imports: [AdminArtistEditComponent],
  templateUrl: './admin-artists-list.component.html',
  styleUrl: './admin-artists-list.component.css'
})
export class AdminArtistsListComponent {

  private artistService = inject(ArtistService);
  private tokenService = inject(TokenService);
  artists = signal<Artist[]>([]);
  editArtist: boolean = false;
  artistToEdit = signal<Artist | undefined>(undefined);
  idTattooStudio: number | undefined;

  ngOnInit() {
    const idAdmin = this.tokenService.getProfileUserDto()?.idUser;
    if (idAdmin != null) {
      this.artistService.getArtistByIdUser(idAdmin).subscribe(data => {
        console.log(data);
        this.artists.set(data);
        this.idTattooStudio = data[0].idTattooStudio;
      })
    }
  }

  prepareAddArtist() {
    this.artistToEdit.set(undefined);
    this.editArtist = true;
  }

  deleteArtist(idArtist: number) {
    if (!confirm("Are you sure that you want to delete this artist")) return;
    this.artistService.deleteArtist(idArtist).subscribe(() => {
      this.artists.update(artists =>
        artists.filter(artist => artist.idArtist !== idArtist)
      );
    });
  }

  prepareEditArtist(artist: Artist) {
    this.artistToEdit.set(artist);
    this.editArtist = true;
  }

    onEditFinished(artistToCreateOrEdit: Artist | undefined) {
      if (artistToCreateOrEdit) {
        this.artists.update(artists => {
          const exists = artists.some(s => s.idArtist === artistToCreateOrEdit.idArtist);
          if (exists) {
            return artists.map(s => s.idArtist === artistToCreateOrEdit.idArtist ? artistToCreateOrEdit : s);
          } else {
            return [...artists, artistToCreateOrEdit];
          }
        });
      }
      this.editArtist = false;
      this.artistToEdit.set(undefined);
    }

}
