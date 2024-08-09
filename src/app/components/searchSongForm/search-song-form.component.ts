import {  Observable, map } from 'rxjs';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpotifySearch } from '@services/api/search.interface';
import { SearchResult } from '@interfaces/searchResult';
import { SpotifyService } from '@services/api/spotify.service';



@Component({
  selector: 'app-search-song-form',
  templateUrl: './search-song-form.component.html',
  styleUrls: ['./search-song-form.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule,FormsModule],
})
export class SearchSongFormComponent {
  @Output() results = new EventEmitter<Observable<SearchResult[]>>();

  constructor(private spotifyService: SpotifyService) { }
  
  input: string = ''
  
  onSearch(searchQuery: string): void {
    if (!searchQuery.trim()) return;

    const searchResults$ = this.spotifyService.search(searchQuery).pipe(
      map((response) => this.processSearchResults(response)));
  
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
