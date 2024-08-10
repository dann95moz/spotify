import {  map, Observable, } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SpotifyService } from '@services/api/spotify.service';
import { User } from '@services/api/user.interface';
import { Item } from '@services/api/playList.interface';
import { PaginatedCardListComponent } from "../../components/paginated-card-list/paginated-card-list.component";
@Component({
  selector: 'app-logged',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    PaginatedCardListComponent
  ],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss',
})
export class LoggedComponent implements OnInit {
  userProfile:Observable<User> = new Observable()
  playlists$: Observable<Item[]>;
  constructor(private spotifyService: SpotifyService, private router: Router) {
    this.playlists$ = this.spotifyService.getUserPlaylists().pipe(
      map((listObject) => listObject.items)
    );
  }

  ngOnInit(): void {
    this.userProfile=  this.spotifyService.getUserProfile()
  }

  goToPlaylistDetails(playlistId: string) {
    this.router.navigate([`/logged/playlist/`, playlistId]);
  }

}
