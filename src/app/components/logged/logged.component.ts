import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { SpotifyService } from '../../services/api/spotify.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/api/user.interface';

@Component({
  selector: 'app-logged',
  standalone: true,
  imports: [MatFormField, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss'
})
export class LoggedComponent implements OnInit{
  searchQuery: string = '';
  searchResults: any;
  isLoading: boolean = false;
  userProfile: any;
  constructor(private spotifyService: SpotifyService) {
    
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.spotifyService.getUserProfile().subscribe({
      next: (profile:User) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }
  onSearch() {
    this.isLoading = true;
    this.spotifyService.search(this.searchQuery, 'track,artist,album', true).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
  }
}

