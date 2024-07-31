import { Component, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinner }from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SpotifyService } from '../../services/api/spotify.service';

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
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnDestroy {
  searchQuery = '';
  results: SearchResult[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private spotifyService: SpotifyService, private router: Router) { }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    
    this.isLoading = true;
    this.spotifyService.search(this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.results = this.processSearchResults(response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching:', error);
          this.isLoading = false;
         //maneja los errores
        }
      });
  }

  private processSearchResults(response: any): SearchResult[] {
    // Procesa y combina los resultados de tracks, artists y albums
    const tracks = response.tracks?.items || [];
    const artists = response.artists?.items || [];
    const albums = response.albums?.items || [];

    return [...tracks, ...artists, ...albums].map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      // Mapea más propiedades según necesites
    }));
  }

  viewDetails(item: SearchResult): void {
    this.router.navigate(['/details', item.type, item.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}