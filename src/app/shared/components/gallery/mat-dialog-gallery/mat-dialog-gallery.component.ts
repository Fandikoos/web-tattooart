import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Image } from '../../../models/interfaces/Image';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-mat-dialog-gallery',
  templateUrl: './mat-dialog-gallery.component.html',
  styleUrl: './mat-dialog-gallery.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatDialogGalleryComponent {

  constructor(public matDialogRef: MatDialogRef<MatDialogGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Image[]
  ) { }

}
