import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Artist } from '../../../../shared/models/interfaces/Artist';
import { ArtistService } from '../../../../core/services/artist.service';
import { ImageService } from '../../../../core/services/image.service';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-admin-artist-edit',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './admin-artist-edit.component.html',
  styleUrl: './admin-artist-edit.component.css'
})
export class AdminArtistEditComponent implements OnInit {

  artist = input<Artist>();
  idTattooStudio = input.required<number | undefined>();
  artistToEmit = output<Artist | undefined>();
  private artistService = inject(ArtistService);
  private imageService = inject(ImageService);
  private tokenService = inject(TokenService);
  private idArtist!: number;
  private isEditingArtist: boolean = false;
  selectedFile: File | null = null;

  editArtistForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    surname: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    secondSurname: new FormControl<string>(''),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    dni: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    imageArtist: new FormControl<string>(''),
  })

  constructor() {
    effect(() => {
      const artist = this.artist();
      if (artist) {
        this.idArtist = artist.idArtist!;
      }
    })
  }

  ngOnInit() {
    if (this.artist() != null || this.artist() != undefined) {
      this.isEditingArtist = true;
      this.editArtistForm.patchValue({
        name: this.artist()?.name ?? '',
        surname: this.artist()?.surname ?? '',
        secondSurname: this.artist()?.secondSurname ?? '',
        email: this.artist()?.email ?? '',
        dni: this.artist()?.dni ?? '',
        phone: this.artist()?.phone ?? 0,
        imageArtist: this.artist()?.imageArtist ?? '',
      })
    } else {
      this.isEditingArtist = false;
    }
  }

  saveArtist() {
    if (this.editArtistForm.invalid) {
      this.editArtistForm.markAllAsTouched();
      return;
    }

    if (this.isEditingArtist && !this.idArtist) {
      return;
    }

    if (this.idTattooStudio == null || this.idTattooStudio == undefined) {
      console.error("No se ha encontrado el id del estudio")
      return;
    }

    const formValueArtistEdit = this.editArtistForm.getRawValue();

    const artist: Artist = {
      idArtist: this.isEditingArtist ? this.idArtist : undefined,
      name: formValueArtistEdit.name,
      surname: formValueArtistEdit.surname,
      secondSurname: formValueArtistEdit.secondSurname != null ? formValueArtistEdit.secondSurname : '',
      email: formValueArtistEdit.email,
      dni: formValueArtistEdit.dni,
      phone: formValueArtistEdit.phone,
      imageArtist: formValueArtistEdit.imageArtist != null ? formValueArtistEdit.imageArtist : '',
      idTattooStudio: this.idTattooStudio()!,
    }

    if (this.isEditingArtist) {
      this.artistService.updateArtist(this.idArtist, artist).subscribe({
        next: () => {
          this.artistToEmit.emit(artist);
        },
        error: () => console.log("Error editando")
      })
    } else {
      this.artistService.createArtist(artist).subscribe({
        next: () => {
          this.artistToEmit.emit(artist);
        },
        error: () => console.log("Error creando")
      })
    }
  }

  close() {
    this.artistToEmit.emit(undefined);
  }
}