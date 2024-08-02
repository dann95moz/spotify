import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { Observable, switchMap } from 'rxjs';
import { PrivatePlayList } from '../../services/api/privatePlayList';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/api/spotify.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit {
  playListDetails$: Observable<PrivatePlayList>;
  deviceId?: string;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {
    this.playListDetails$ = this.route.params.pipe(
      switchMap(params => this.spotifyService.getPlaylistDetails(params['playlistId']))
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

    this.route.params.pipe(
      switchMap(params => {
        const playlistUri = `spotify:playlist:${params['playlistId']}`;
        return this.playerService.playPlaylist(playlistUri);
      })
    ).subscribe({
      next: () => console.log('Playlist is playing'),
      error: (err) => console.error('Error playing playlist:', err)
    });
  }

  play() {
    this.playerService.play();
  }

  pause() {
    this.playerService.pause();
  }

  setVolume(event: any) {
    const volume = event.target.value;
    this.playerService.setVolume(volume);
  }

  playTrack(trackUri: string) {
    this.playerService.playTrack(trackUri);
    
  }
}
