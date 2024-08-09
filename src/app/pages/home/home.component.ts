import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginBtnComponent } from '@components/login-btn/login-btn.component';
import { SearchSongFormComponent } from '@components/searchSongForm/search-song-form.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { CardListComponent } from "@components/card-list/card-list.component";
import { SearchResult } from '@interfaces/searchResult';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinner,
    SearchSongFormComponent,
    LoginBtnComponent,
    PaginatorComponent,
    CardListComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent   {
  isLoading: boolean = false;
  searchResults$: Observable<SearchResult[]> | null = null;
  searchQuery: string = '';
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
