import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginBtnComponent } from '@components/login-btn/login-btn.component';
import { SearchSongFormComponent } from '@components/searchSongForm/search-song-form.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { CardListComponent } from "@components/card-list/card-list.component";
import { SearchResult } from '@interfaces/searchResult';
import { PaginatedCardListComponent } from '@components/paginated-card-list/paginated-card-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinner,
    SearchSongFormComponent,
    LoginBtnComponent,
    PaginatorComponent,
    CardListComponent,PaginatedCardListComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent   {

}
