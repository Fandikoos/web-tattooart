import { Component, inject, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudioService } from '../../../shared/services/studio.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Filter } from '../../../shared/models/dtos/Filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./filter.component.css']
})
export class FilterComponent{

  filterChange = output<Filter>();

  filterForm = new FormGroup({
    name: new FormControl('', Validators.minLength(3)),
    minRating: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    maxRating: new FormControl(5, [Validators.min(0), Validators.max(5)])
  });


  onSubmit() {
    const name = this.filterForm.value.name != null ? this.filterForm.value.name : '';
    const minRating = this.filterForm.value.minRating != null ? this.filterForm.value.minRating : 0;
    const maxRating = this.filterForm.value.maxRating != null ? this.filterForm.value.maxRating : 5;
    const filter = new Filter(name, minRating, maxRating);
    this.filterChange.emit(filter);
  }
}


