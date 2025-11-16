import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Studio } from '../../../../shared/models/interfaces/Studio';
import { StudioService } from '../../../../shared/services/studio.service';

@Component({
  selector: 'app-admin-studio-edit',
  templateUrl: './admin-studio-edit.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./admin-studio-edit.component.css'],
})
export class AdminStudioEditComponent implements OnInit {
  
  studio = input<Studio>();
  updatedStudio = output<Studio>();
  private studioService = inject(StudioService);
  idStudio!: number;

  editStudioForm = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    address: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    lat: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    long: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    openSchedule: new FormControl(),
    closeSchedule: new FormControl(),
    description: new FormControl(),
  });
  
  constructor() {
    effect(() => {
      const studio = this.studio();
      if(studio){
        this.idStudio = studio.idStudio;
      }
    })
  }

  ngOnInit() {
    if(this.studio() != null){
      this.editStudioForm.patchValue({
        name: this.studio()?.name,
        address: this.studio()?.address,
        lat: this.studio()?.latitud,
        long: this.studio()?.longitud,
        openSchedule: this.studio()?.openSchedule,
        closeSchedule: this.studio()?.closeSchedule,
        description: this.studio()?.description
      });
    }
  }

  onSubmit() {
    if (this.editStudioForm.invalid || !this.idStudio) {
      this.editStudioForm.markAllAsTouched();
      return;
    }

    const formValueStudioEdit = this.editStudioForm.getRawValue();

    const updateStudio: Studio = {
      idStudio: this.idStudio,
      name: formValueStudioEdit.name,
      address: formValueStudioEdit.address,
      latitud: formValueStudioEdit.lat,
      longitud: formValueStudioEdit.long,
      rating: this.studio()!.rating,
      openSchedule: formValueStudioEdit.openSchedule,
      closeSchedule: formValueStudioEdit.closeSchedule,
      description: formValueStudioEdit.description,
      logo: this.studio()!.logo,
      artists: this.studio()!.artists,
      images: this.studio()!.images
    };
    
    this.studioService.update(this.idStudio, updateStudio).subscribe({
      next: () => this.updatedStudio.emit(updateStudio),
      error: () => console.log("Error updateando")
    });
  }
}
