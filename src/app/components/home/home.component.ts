import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatList, MatListItem } from '@angular/material/list';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbar,MatFormField,MatLabel,MatList,MatListItem,NgIf,FormsModule,NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchQuery: string = '';
  results: any[] = [];

  constructor(private spotifyService: SpotifyService, private router: Router) { }

  async onSearch() {
    const response = await this.spotifyService.search(this.searchQuery);
    this.results = [...response.tracks.items, ...response.artists.items, ...response.albums.items];
  }

  viewDetails(item: any) {
    this.router.navigate(['/details', item.type, item.id]);
  }
}
