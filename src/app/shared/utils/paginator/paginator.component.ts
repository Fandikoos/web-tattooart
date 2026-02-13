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
export class PaginatorComponent {

  pageSize = input<number>(10);
  length = input<number>(0);
  pageChange = output<PageEvent>();

  onPageChange($event: PageEvent) {
    this.pageChange.emit($event);
  }

}
