import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { Observable, switchMap } from 'rxjs';
import { PrivatePlayList } from '../../services/api/privatePlayList';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/api/spotify.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatSliderModule],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss'],
})
export class PlaylistDetailsComponent implements OnInit {
  playListDetails$: Observable<PrivatePlayList>;
  deviceId?: string;
  currentVolume: number = 0.5;
  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {
    this.playListDetails$ = this.route.params.pipe(
      switchMap((params) =>
        this.spotifyService.getPlaylistDetails(params['playlistId'])
      )
    );
  }

  ngOnInit(): void {
    this.deviceId = this.playerService.getDeviceId();
  }

  playPlaylist() {
    if (!this.deviceId) {
      console.error('No device ID available.');
      return;
    }

    this.route.params
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
    console.log(target.value);
    const volume = parseFloat(target.value) / 100;
    console.log('Volume set to:', volume);
    this.playerService.setVolume(volume);
  }

  playTrack(trackUri: string) {
    this.playerService.playTrack(trackUri);
  }
}
