import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { Observable, switchMap, tap } from 'rxjs';
import { PrivatePlayList } from '../../services/api/privatePlayList';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/api/spotify.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatSliderModule,MatIconModule],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss'],
})
export class PlaylistDetailsComponent implements OnInit , OnDestroy{
  defaultImgUrl = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
  playListDetails$: Observable<PrivatePlayList>;
  currentVolume: number = 0.5;
  isDeviceReady: Observable<boolean>= new Observable()
  constructor(
    private playerService: PlayerService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {
  
    this.playListDetails$ = this.activatedRoute.params.pipe(
      switchMap((params) =>
        this.spotifyService.getPlaylistDetails(params['playlistId'])
      ),
    );
  }
  ngOnInit(): void {

this.playerService.initializePlayer()
  this.isDeviceReady= this.playerService.isDeviceReady
 }

  ngOnDestroy(): void {
    this.pause()
  }
  goToLogged() {
    this.router.navigate(['/logged'])
    }
  playPlaylist() {
 
    if (!this.playerService.getDeviceId()) {
      console.error('No device ID available.');
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          const playlistUri = `spotify:playlist:${params['playlistId']}`;
          return this.playerService.playPlaylist(playlistUri);
        })
      )
      .subscribe({
        next: () => console.log('Playlist is playing'),
        error: (err) => console.error('Error playing playlist:', err),
      });
  }

  play() {
    this.playerService.play();
  }

  pause() {
    this.playerService.pause();
  }

  setVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value) / 100;
    this.playerService.setVolume(volume);
  }

  playTrack(trackUri: string) {
    this.playerService.playTrack(trackUri);
  }
}
