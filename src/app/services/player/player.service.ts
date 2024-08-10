import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../spotifyAuth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private player: any;
  private deviceId: string | undefined;
  public deviceIsReady: BehaviorSubject<boolean> = new BehaviorSubject(false)
  //TODO: convert to observable
  constructor(private authService: AuthService, private http: HttpClient) {

  }

  public initializePlayer(): void {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      this.player = new (window as any).Spotify.Player({
        name: 'Angular Spotify Player',
        getOAuthToken: (cb: (token: string) => void) => {
          this.authService.getTokenObservable().subscribe({
            next: (token) => {
              if (token) {
                cb(token);
              } else {
                console.error('No token available');
              }
            },
            error: (error) => console.error('Error getting token:', error),
          });
        },
        volume: 0.5,
      });
      console.log('starting listeners')
      this.setupPlayerListeners();
      console.log('starting connection')
      this.connectPlayer();
    };
  }

  private setupPlayerListeners(): void {
    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID in service', device_id);
      this.deviceId = device_id;
    });

    this.player.addListener(
      'not_ready',
      ({ device_id }: { device_id: string }) => {
        console.log('Device ID is not ready:', device_id);
        this.deviceId = undefined;
      }
    );
  }

  private connectPlayer(): void {
    this.player.connect().then((success: boolean) => {
      if (!success) {
        console.error('The Spotify Player failed to connect.');
      } else {
        this.deviceIsReady.next(true)
      }
    });
  }

  play(): void {
    this.player?.resume().catch(this.handleError);
  }

  pause(): void {
    this.player?.pause().catch(this.handleError);
  }

  setVolume(volume: number): void {
    this.player?.setVolume(volume).catch(this.handleError);
  }

  playPlaylist(playlistUri: string): Observable<void> {
    if (!this.deviceId) {
      return throwError(() => new Error('No device ID available.'));
    }

    return this.authService.getTokenObservable().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(
            () => new Error('User token is invalid or expired.')
          );
        }

        const body = { context_uri: playlistUri };
        return this.http
          .put<void>(
            `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
            body,
            { headers: this.getHeaders(token) }
          )
          .pipe(
            catchError((error) => {
              console.error('Error playing playlist:', error);
              return throwError(() => new Error('Failed to play playlist.'));
            })
          );
      })
    );
  }

  playTrack(trackUri: string): Observable<void> {
    if (!this.deviceId) {
      return throwError(() => new Error('No device ID available.'));
    }

    return this.authService.getTokenObservable().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(
            () => new Error('User token is invalid or expired.')
          );
        }

        return this.http
          .put(
            'https://api.spotify.com/v1/me/player/play',
            { uris: [trackUri] },
            { headers: this.getHeaders(token) }
          )
          .pipe(
            switchMap(() => of(void 0)),
            catchError((error) => {
              console.error('Error playing track:', error);
              return throwError(() => new Error('Failed to play track.'));
            })
          );
      })
    );
  }

  setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  getDeviceId(): string | undefined {
    return this.deviceId;
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
