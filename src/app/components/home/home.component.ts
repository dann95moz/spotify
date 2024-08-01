import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { AuthService } from '../../services/spotifyAuth/auth.service';
import { PlayerService } from '../../services/player/player.service';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
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
    MatPaginatorModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
  
})
export class HomeComponent implements OnDestroy  {
  searchQuery = '';
  results: SearchResult[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();
  paginatedResults: any[] = [];

  pageSize = 5;
  constructor(private spotifyService: SpotifyService, private router: Router, private authService: AuthService) { 

  }
 
  login() {
    
    this.authService.login();
  }
  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    
    this.isLoading = true;
    this.spotifyService.search(this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.results = this.processSearchResults(response);
          this.paginatedResults = this.results.slice(0, this.pageSize);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching:', error);
          this.isLoading = false;
         //maneja los errores
        }
      });
  }
  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedResults = this.results.slice(startIndex, endIndex);
  }
  private processSearchResults(response: any): SearchResult[] {
    
    const tracks = response.tracks?.items || [];
    const artists = response.artists?.items || [];
    const albums = response.albums?.items || [];

    return [...tracks, ...artists, ...albums].map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
  
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