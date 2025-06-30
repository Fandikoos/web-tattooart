import { Component, effect, inject, OnInit } from '@angular/core';
import { StudioService } from '../../../shared/services/studio.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FilterComponent } from "../filter/filter.component";


@Component({
  selector: 'app-studio-list',
  templateUrl: './studio-list.component.html',
  styleUrls: ['./studio-list.component.css'],
  imports: [
    RouterLink,
    FilterComponent
]
})
export class StudioListComponent implements OnInit {

  private studioService = inject(StudioService);

  private studios$ = this.studioService.getAll();
  public studios = toSignal(this.studios$);

  constructor() {}

  ngOnInit() {

  }

}
