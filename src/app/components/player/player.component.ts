import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true,
})
export class PlayerComponent implements AfterViewInit {
  constructor(private playerService: PlayerService) {
   
  }

  ngAfterViewInit(): void {
    // Initialize the player when the component is loaded

  }

  play() {
   
    
    this.playerService.player?.play().then(() => {
    }).catch((error:any) => {
      console.error('Error starting playback', error);
    });
  }

  pause() {
    this.playerService.player?.pause().then(() => {
      console.log('Playback paused');
    }).catch((error:any) => {
      console.error('Error pausing playback', error);
    });
  }

  nextTrack() {
    this.playerService.player?.nextTrack().then(() => {
      console.log('Skipped to next track');
    }).catch((error:any) => {
      console.error('Error skipping to next track', error);
    });
  }

  previousTrack() {
    this.playerService.player?.previousTrack().then(() => {
      console.log('Skipped to previous track');
    }).catch((error:any) => {
      console.error('Error skipping to previous track', error);
    });
  }

  setVolume(event: any) {
    const volume = event.target.value;
    this.playerService.player?.setVolume(volume).then(() => {
      console.log(`Volume set to ${volume}`);
    }).catch((error:any) => {
      console.error('Error setting volume', error);
    });
  }
}
