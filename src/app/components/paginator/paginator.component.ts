import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchResult } from '@interfaces/searchResult';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [  MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() results : SearchResult[]=[] 
  @Output() paginatedResults = new EventEmitter<SearchResult[]>();
  pageSize: number = 5;
  onPageChange(event: PageEvent): void {
    const startIndex: number = event.pageIndex * event.pageSize;
    const endIndex: number = startIndex + event.pageSize;
    this.paginatedResults.emit(this.results.slice(startIndex, endIndex));
  }
}
