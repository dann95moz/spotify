import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, Observable, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AsyncPipe } from '@angular/common';
import { LoginBtnComponent } from '@components/login-btn/login-btn.component';
import { SearchSongFormComponent } from '@components/searchSongForm/search-song-form.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { CardListComponent } from "../../components/card-list/card-list.component";
interface SearchResult {
  id: string;
  type: string;
  name: string;
  // Añade más propiedades según la estructura de los resultados de Spotify
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinner,
    FormsModule,
    MatIcon,
    MatCardModule,
    MatPaginatorModule,
    SearchSongFormComponent,
    AsyncPipe,
    LoginBtnComponent,
    PaginatorComponent,
    CardListComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent   {
  constructor(
    private router: Router,
   
  ) {}
  isLoading: boolean = false;
  searchResults$: Observable<SearchResult[]> | null = null;
  searchQuery: string = '';
  results: SearchResult[] = [];
  paginatedResults: SearchResult[] = [];
  onPaginatedResults(paginatedResults: SearchResult[]) {
    this.paginatedResults= paginatedResults
  }
  pageSize: number = 5;
  handleSearch(results$: Observable<SearchResult[]>) {
    this.isLoading = true
    this.searchResults$ = results$.pipe(
      tap((response) => {
        this.results= response
        this.paginatedResults = response.slice(0, this.pageSize);
      }),
    finalize(()=>this.isLoading= false));

}

  viewDetails(item: SearchResult): void {
    this.router.navigate(['/details', item.type, item.id]);
  }
 

}
