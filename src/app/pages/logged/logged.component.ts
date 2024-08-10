import { finalize, map, Observable, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '@services/api/spotify.service';
import { User } from '@services/api/user.interface';
import { Item } from '@services/api/playList.interface';
import { SearchSongFormComponent } from '../../components/searchSongForm/search-song-form.component';
import { SearchResult } from '@interfaces/searchResult';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { CardListComponent } from '@components/card-list/card-list.component';
@Component({
  selector: 'app-logged',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatListModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SearchSongFormComponent,
    PaginatorComponent,
    CardListComponent,
  ],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss',
})
export class LoggedComponent implements OnInit {
  searchQuery: string = '';
  searchResults$: Observable<SearchResult[]> | null = null;
  paginatedResults: SearchResult[] = [];
  results: SearchResult[] = [];
  isLoading: boolean = false;
  userProfile: any;
  playlists$: Observable<Item[]>;
  pageSize: number = 5;
  constructor(private spotifyService: SpotifyService, private router: Router) {
    this.playlists$ = this.spotifyService.getUserPlaylists().pipe(
      map((listObject) => {
        return listObject.items;
      })
    );
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  goToPlaylistDetails(playlistId: string) {
    this.router.navigate([`/logged/playlist/`, playlistId]);
  }

  loadUserProfile() {
    this.spotifyService.getUserProfile().subscribe({
      next: (profile: User) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      },
    });
  }
  handleSearch(results$: Observable<SearchResult[]>) {
    this.isLoading = true;
    this.searchResults$ = results$.pipe(
      tap((response) => {
        this.results = response;
        this.paginatedResults = response.slice(0, this.pageSize);
      }),
      finalize(() => (this.isLoading = false))
    );
  }
  onPaginatedResults(paginatedResults: SearchResult[]) {
    this.paginatedResults = paginatedResults;
  }
}
