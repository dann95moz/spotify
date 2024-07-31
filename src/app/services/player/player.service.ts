// src/app/services/player.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }
  player: any;

  initializePlayer() {
    if (window.Spotify) {
      console.log('Initializing player');
      const token = localStorage.getItem('spotify_token');

      if (!token) {
        console.error('No token found in localStorage');
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
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.player.addListener('initialization_error', (e: any) => {
        console.error('Initialization error:', e);
      });

      this.player.addListener('authentication_error', (e: any) => {
        console.error('Authentication error:', e);
      });

      this.player.addListener('account_error', (e: any) => {
        console.error('Account error:', e);
      });

      this.player.addListener('playback_error', (e: any) => {
        console.error('Playback error:', e);
      });

      this.player.connect().then((success: boolean) => {
        if (success) {
          console.log('Player connected successfully');
        } else {
          console.error('Failed to connect player');
        }
      });
    } else {
      console.error('Spotify SDK not loaded');
    }
  }
}
