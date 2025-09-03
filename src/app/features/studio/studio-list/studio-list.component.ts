import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { StudioService } from '../../../shared/services/studio.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FilterComponent } from "../filter/filter.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Studio } from '../../../shared/models/Studio';
import { PaginatorComponent } from '../../../shared/utils/paginator/paginator.component';


@Component({
  selector: 'app-studio-list',
  templateUrl: './studio-list.component.html',
  styleUrls: ['./studio-list.component.css'],
  imports: [
    RouterLink,
    FilterComponent,
    MatPaginatorModule,
    PaginatorComponent,
]
})
export class StudioListComponent implements OnInit {

  private studioService = inject(StudioService);

  private studios$ = this.studioService.getAll();
  public studios = toSignal(this.studios$);
  
  // Señal para recibir los estudios paginados
  paginatedStudios = signal<Studio[]>([]);

  onPaginatedStudiosChange(studios: Studio[]){
    // Se reciben los estudios ya paginados
    this.paginatedStudios.set(studios);
  }

  onFilterChange(name: string){
    if(name.length > 0){
      this.studioService.findByName(name).subscribe(data => this.paginatedStudios.set(data))
    } else {
      this.studioService.getAll().subscribe(data => this.paginatedStudios.set(data))
    }
  }

  ngOnInit() {  }

}
