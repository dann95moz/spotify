import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import { PrivatePlayList } from '../../services/api/privatePlayList';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/api/spotify.service';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss'
})
export class PlaylistDetailsComponent implements OnInit{
  playListDetails$: Observable<PrivatePlayList>

  constructor(private playerService: PlayerService,private route: ActivatedRoute, private spotifyService:SpotifyService) { 
    this.playListDetails$ = this.route.params.pipe(
      switchMap(params => this.spotifyService.getPlaylistDetails(params['playlistId'])),
      
    )
    
  }
  ngOnInit(): void {
    this.playerService.initializePlayer()
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
}
