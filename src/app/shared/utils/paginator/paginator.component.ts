import { ChangeDetectionStrategy, Component, computed, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [
    MatPaginatorModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnChanges{

  // Inputs que se reciben (padre -> hijo)
  objectsToPaginate = input.required<any[]>();
  initialPageSize = input<number>(9);
  initialPageIndex = input<number>(0);
  pageSizeOptions = input<number[]>([10, 50, 100]);
  showFirstLastButtons = input<boolean>(false);
  hidePageSize = input<boolean>(false);

  // Outputs que salen (hijo -> padre)
  paginatedObjects = output<any[]>();

  // Estado interno, cuando cambian todo lo que dependa de ellas se actualiza
  currentPageIndex = signal(this.initialPageIndex());
  currentPageSize = signal(this.initialPageSize());

  //Computed values, son solo de lectura, siempre estan actualizados y optimizan el rendimiento (solo se recalculan cuando es necesario)
  paginatedItems = computed(() => {
    const startIndex = this.currentPageIndex() * this.currentPageSize();
    const endIndex = startIndex + this.currentPageSize();
    return this.objectsToPaginate().slice(startIndex, endIndex);
  })

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambian los items, resetear a la primera página
    if(changes['objectsToPaginate']){
      this.currentPageIndex.set(0);
      this.emitPaginatedItems();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex.set(event.pageIndex); // ← Actualiza página
    this.currentPageSize.set(event.pageSize);   // ← Actualiza tamaño
    
    this.emitPaginatedItems();                 // ← Envía datos paginados
  }

  private emitPaginatedItems() {
    this.paginatedObjects.emit(this.paginatedItems());
  }
}
