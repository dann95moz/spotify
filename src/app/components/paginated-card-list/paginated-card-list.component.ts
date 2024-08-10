import { Component } from '@angular/core';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { SearchSongFormComponent } from '@components/searchSongForm/search-song-form.component';
import { CardListComponent } from '../card-list/card-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, Observable, tap } from 'rxjs';
import { SearchResult } from '@interfaces/searchResult';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'paginated-card-list',
  standalone: true,
  imports: [SearchSongFormComponent, PaginatorComponent,CardListComponent,MatProgressSpinnerModule,AsyncPipe],
  templateUrl: './paginated-card-list.component.html',
  styleUrl: './paginated-card-list.component.scss'
})
export class PaginatedCardListComponent {
  isLoading: boolean = false;
  searchResults$: Observable<SearchResult[]> | null = null;
  results: SearchResult[] = [];
  paginatedResults: SearchResult[] = [];
  pageSize: number = 5;
  onPaginatedResults(paginatedResults: SearchResult[]) {
    this.paginatedResults= paginatedResults
  }
  handleSearch(results$: Observable<SearchResult[]>) {
    this.isLoading = true
    this.searchResults$ = results$.pipe(
      tap((response) => {
        this.results= response
        this.paginatedResults = response.slice(0, this.pageSize);
      }),
    finalize(()=>this.isLoading= false));
}
}
