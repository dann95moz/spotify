import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../spotifyAuth/auth.service';
import { SpotifyService } from '../api/spotify.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private player: any;  // Tipo 'any' para evitar problemas con el espacio de nombres
  private deviceId: string | undefined;

  constructor(private authService: AuthService, private http: HttpClient, private spotifyService: SpotifyService) {
    this.initializePlayer();  // Inicializar el reproductor aquí
  }

  public initializePlayer(): void {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const token = this.authService.getTokenFromStorage(); // Obtén el token de acceso de manera segura

      this.player = new (window as any).Spotify.Player({
        name: 'Angular Spotify Player',
        getOAuthToken: (cb: (token: string) => void) => {
          const token = this.authService.getTokenFromStorage(); // Obtén el token de acceso de manera segura
          if (token) {
            cb(token);
          } else {
            console.error('No token available');
          }
        },
        volume: 0.5,
      });

      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID in service', device_id);
        this.deviceId = device_id;
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        this.deviceId = undefined;
      });

      this.player.connect().then((success: boolean) => {
        if (!success) {
          console.error('The Spotify Player failed to connect.');
        } 
      });
    };
  }

  play(): void {
    this.player?.resume().then(() => {
    }).catch(this.handleError);
  }

  pause(): void {
    this.player?.pause().then(() => {
    }).catch(this.handleError);
  }

  setVolume(volume: number): void {
    this.player?.setVolume(volume).then(() => {
    
    }).catch(this.handleError);
  }

  playPlaylist(playlistUri: string): Observable<void> {
    if (!this.deviceId) {
      return throwError(() => new Error('No device ID available.'));
    }
  
    return this.authService.getTokenObservable().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          return throwError(() => new Error('User token is invalid or expired.'));
        }
  
        const body = {
          context_uri: playlistUri
        };
  
        return this.http.put<void>(
          `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
          body,
          {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }),
          }
        ).pipe(
          catchError((error) => {
            console.error('Error playing playlist:', error);
            return throwError(() => new Error('Failed to play playlist.'));
          })
        );
      })
    );
  }
  

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getDeviceId() {
    return this.deviceId;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  playTrack(trackUri: string): Observable<void> {
    console.log(this.deviceId);
    
    if (!this.deviceId) {
      return throwError(() => new Error('No device ID available.'));
    }

    return this.authService.getTokenObservable().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('User token is invalid or expired.'));
        }

        return this.http.put(
          'https://api.spotify.com/v1/me/player/play',
          { uris: [trackUri] },
          {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }),
          }
        ).pipe(
          switchMap(() => of(void 0)),  // Convert observable to void
          catchError((error) => {
            console.error('Error playing track:', error);
            return throwError(() => new Error('Failed to play track.'));
          })
        );
      })
    );
  }
}
