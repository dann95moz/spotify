import { Component, OnInit } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { SpotifyService } from '../../services/api/spotify.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/api/user.interface';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Item } from '../../services/api/playList.interface';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerService } from '../../services/player/player.service';
import { Router } from '@angular/router';
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
  ],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss',
})
export class LoggedComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any;
  isLoading: boolean = false;
  userProfile: any;
  playlists$: Observable<Item[]>;
  constructor(private spotifyService: SpotifyService,private router:Router) {
 
    this.playlists$ = this.spotifyService.getUserPlaylists().pipe(
      map((listObject) => {
        return listObject.items;
      })
    );
    
  }

  ngOnInit(): void {
    this.loadUserProfile();

    
  }

  goToPlaylistDetails(playlistId:string) {
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
  onSearch() {
    this.isLoading = true;
    this.spotifyService
      .search(this.searchQuery, 'track,artist,album', true)
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        },
      });
  }
}
