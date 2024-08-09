import { Component, Input } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchResult } from '@interfaces/searchResult';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [  MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() results : SearchResult[]=[] 
  pageSize: number = 5;
  paginatedResults: SearchResult[] = [];
  onPageChange(event: PageEvent): void {
    const startIndex: number = event.pageIndex * event.pageSize;
    const endIndex: number = startIndex + event.pageSize;
    this.paginatedResults = this.results.slice(startIndex, endIndex);
  }
}
