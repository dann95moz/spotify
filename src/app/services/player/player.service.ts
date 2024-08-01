// src/app/services/player.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  player: any;
  playerReady: Promise<void> | null = null;

  constructor() {}

  initializePlayer(): Promise<void> {
    if (!this.playerReady) {
      this.playerReady = this.loadSpotifySdk().then(() => {
        return new Promise<void>((resolve, reject) => {
          const token = localStorage.getItem('spotify_token');
          if (!token) {
            console.error('No token found in localStorage');
            reject('No token found in localStorage');
            return;
          }

          this.player = new window.Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: (cb: any) => {
              cb(token);
            },
            volume: 0.5,
          });

          this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('Ready with Device ID', device_id);
            resolve();
          });

          this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
            console.log('Device ID has gone offline', device_id);
          });

          this.player.addListener('initialization_error', (e: any) => {
            console.error('Initialization error:', e);
            reject(e);
          });

          this.player.addListener('authentication_error', (e: any) => {
            console.error('Authentication error:', e);
            reject(e);
          });

          this.player.addListener('account_error', (e: any) => {
            console.error('Account error:', e);
            reject(e);
          });

          this.player.addListener('playback_error', (e: any) => {
            console.error('Playback error:', e);
            reject(e);
          });

          this.player.connect().then((success: boolean) => {
            if (success) {
              console.log('Player connected successfully');
            } else {
              console.error('Failed to connect player');
              reject('Failed to connect player');
            }
          });
        });
      }).catch((error) => {
        console.error('Error loading Spotify SDK:', error);
        this.playerReady = null; // Reset playerReady on error
        throw error;
      });
    }

    return this.playerReady;
  }

  private loadSpotifySdk(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (window.Spotify) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.onload = () => {
          if (window.Spotify) {
            resolve();
          } else {
            reject('Spotify SDK failed to load');
          }
        };
        script.onerror = () => {
          reject('Spotify SDK failed to load');
        };
        document.head.appendChild(script);
      }
    });
  }

  play() {
    this.initializePlayer().then(() => {
      this.player.resume().then(() => {
        console.log('Playback resumed');
      }).catch((error: any) => {
        console.error('Error resuming playback:', error);
      });
    }).catch((error: any) => {
      console.error('Player not ready:', error);
    });
  }

  pause() {
    this.initializePlayer().then(() => {
      this.player.pause().then(() => {
        console.log('Playback paused');
      }).catch((error: any) => {
        console.error('Error pausing playback:', error);
      });
    }).catch((error: any) => {
      console.error('Player not ready:', error);
    });
  }

  setVolume(volume: number) {
    this.initializePlayer().then(() => {
      this.player.setVolume(volume).then(() => {
        console.log(`Volume set to ${volume}`);
      }).catch((error: any) => {
        console.error('Error setting volume:', error);
      });
    }).catch((error: any) => {
      console.error('Player not ready:', error);
    });
  }
}
