import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Studio } from '../../../../shared/models/interfaces/Studio';
import { StudioService } from '../../../../shared/services/studio.service';
import { TokenService } from '../../../../shared/services/token.service';

@Component({
  selector: 'app-admin-studio-data-edit',
  templateUrl: './admin-studio-data-edit.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./admin-studio-data-edit.component.css'],
})
export class AdminStudioDataEditComponent implements OnInit {

  studio = input<Studio>();
  studioToEmit = output<Studio | undefined>();
  private studioService = inject(StudioService);
  private tokenService = inject(TokenService);
  private idStudio!: number;
  private isEditingStudio: boolean = false;

  editStudioForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lat: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    long: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    openSchedule: new FormControl(),
    closeSchedule: new FormControl(),
    description: new FormControl(),
  });

  constructor() {
    effect(() => {
      const studio = this.studio();
      if (studio) {
        this.idStudio = studio.idStudio!;
      }
    })
  }

  ngOnInit() {
    if (this.studio() != null || this.studio() != undefined) {
      this.isEditingStudio = true;
      this.editStudioForm.patchValue({
        name: this.studio()?.name ?? '',
        address: this.studio()?.address ?? '',
        lat: this.studio()?.latitud,
        long: this.studio()?.longitud,
        openSchedule: this.studio()?.openSchedule,
        closeSchedule: this.studio()?.closeSchedule,
        description: this.studio()?.description
      });
    } else {
      this.isEditingStudio = false;
    }
  }

  onSubmit() {
    if (this.editStudioForm.invalid) {
      this.editStudioForm.markAllAsTouched();
      return;
    }

    if (this.isEditingStudio && !this.idStudio) {
      return;
    }

    const formValueStudioEdit = this.editStudioForm.getRawValue();

    const studio: Studio = {
      idStudio: this.isEditingStudio ? this.idStudio : undefined,
      name: formValueStudioEdit.name,
      address: formValueStudioEdit.address,
      latitud: formValueStudioEdit.lat,
      longitud: formValueStudioEdit.long,
      rating: this.isEditingStudio ? this.studio()!.rating : 0,
      openSchedule: formValueStudioEdit.openSchedule,
      closeSchedule: formValueStudioEdit.closeSchedule,
      description: formValueStudioEdit.description,
      idUser: this.tokenService.getUserId(),
      logo: this.isEditingStudio ? this.studio()!.logo : '',
      artists: this.isEditingStudio ? this.studio()!.artists : [],
      images: this.isEditingStudio ? this.studio()!.images : []
    };

    if (this.isEditingStudio) {
      this.studioService.update(this.idStudio, studio).subscribe({
        next: () => this.studioToEmit.emit(studio),
        error: () => console.log("Error modificando")
      });
    } else {
      this.studioService.create(studio).subscribe({
        next: (createdStudio) => this.studioToEmit.emit(createdStudio),
        error: () => console.log("Error creando")
      })
    }
  }

  close() {
    this.studioToEmit.emit(undefined);
  }
}
