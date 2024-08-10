import { AfterViewInit, Component } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { Observable, switchMap } from 'rxjs';
import { PrivatePlayList } from '../../services/api/privatePlayList';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/api/spotify.service';
import { AsyncPipe } from '@angular/common';
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
export class PlaylistDetailsComponent implements AfterViewInit {

  playListDetails$: Observable<PrivatePlayList>;
  deviceId?: string;
  currentVolume: number = 0.5;
  constructor(
    private playerService: PlayerService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {
  
    this.playListDetails$ = this.activatedRoute.params.pipe(
      switchMap((params) =>
        this.spotifyService.getPlaylistDetails(params['playlistId'])
      )
    );
  }

  ngAfterViewInit(): void {
   
    this.deviceId = this.playerService.getDeviceId();
    
    
  }
  goToLogged() {
    this.router.navigate(['/logged'])
    }
  playPlaylist() {
    if (!this.deviceId) {
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
