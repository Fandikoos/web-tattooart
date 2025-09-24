import { Component, inject, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudioService } from '../../../shared/services/studio.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./filter.component.css']
})
export class FilterComponent{

  filterChangeNameValue = output<string>();

  filterForm = new FormGroup({
    name: new FormControl('', Validators.minLength(3)),
  });


  onSubmit() {
    const name = this.filterForm.value.name ?? '';
    if (this.filterForm.invalid) {
      this.filterChangeNameValue.emit('');
      return;
    }
    this.filterChangeNameValue.emit(name.trim());
  }
}


