import { Component, EventEmitter, Output } from '@angular/core';
import { SpotifyService } from '../../../services/api/spotify.service';
import { catchError, Observable, of, map } from 'rxjs';
import { SpotifySearch } from '../../../services/api/search.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface SearchResult {
  id: string;
  type: string;
  name: string;
  // Añade más propiedades según la estructura de los resultados de Spotify
}

@Component({
  selector: 'app-search-song-form',
  templateUrl: './search-song-form.component.html',
  styleUrls: ['./search-song-form.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule],
})
export class SearchSongFormComponent {
  @Output() results = new EventEmitter<Observable<SearchResult[]>>();

  constructor(private spotifyService: SpotifyService) {}

  onSearch(searchQuery: string): void {
    if (!searchQuery.trim()) return;

    const searchResults$ = this.spotifyService.search(searchQuery).pipe(
      map((response) => this.processSearchResults(response)),
      catchError((error) => {
        console.error('Error searching:', error);
        return of([]);
      })
    );

    this.results.emit(searchResults$);
  }

  private processSearchResults(response: SpotifySearch): SearchResult[] {
    const tracks = response.tracks?.items || [];
    const artists = response.artists?.items || [];
    const albums = response.albums?.items || [];

    return [...tracks, ...artists, ...albums].map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
    }));
  }
}
