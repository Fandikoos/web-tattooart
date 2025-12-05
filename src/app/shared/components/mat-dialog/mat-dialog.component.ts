import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Image } from '../../models/interfaces/Image';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrl: './mat-dialog.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MatDialogComponent {

  constructor(public matDialogRef: MatDialogRef<MatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Image[]
  ) {
    console.log(data);
  }

}
