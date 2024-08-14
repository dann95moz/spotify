import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../spotifyAuth/auth.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiUrl = environment.spotifyApi;
  private clientId = environment.spotifyClientId;
  private clientSecret = environment.spotifyClientSecret;
  private clientToken = '';
  private clientTokenExpirationTime = 0;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private authenticateClient(): Observable<void> {
    const body = new HttpParams().set('grant_type', 'client_credentials');
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers }).pipe(
      map(response => {
        this.clientToken = response.access_token;
        this.clientTokenExpirationTime = Date.now() + (response.expires_in * 1000);
      }),
      catchError(this.handleError)
    );
  }

  private ensureClientTokenValid(): Observable<string> {
    if (!this.clientToken || Date.now() > this.clientTokenExpirationTime) {
      return this.authenticateClient().pipe(
        switchMap(() => of(this.clientToken))
      );
    }
    return of(this.clientToken);
  }

  private ensureUserTokenValid(): Observable<string> {
    return this.authService.getTokenObservable().pipe(
      switchMap(token => {
        if (!token) {
          return throwError(() => new Error('User token is invalid or expired.'));
        }
        return of(token);
      })
    );
  }

  private request<T>(method: string, endpoint: string, options: any = {}, useUserToken: boolean = true): Observable<HttpEvent<T>> {
    const tokenObservable = useUserToken ? this.ensureUserTokenValid() : this.ensureClientTokenValid();

    return tokenObservable.pipe(
      switchMap(token => {
        const url = `${this.apiUrl}/${endpoint}`;
        options.headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.request<T>(method, url, options);
      }),
      catchError(this.handleError)
    );
  }

  search(query: string, type: string = 'track,artist,album', useUserToken: boolean = false): Observable<any> {
    const params = new HttpParams().set('q', query).set('type', type);
    return this.request('GET', 'search', { params }, useUserToken);
  }

  getDetails(type: string, id: string, useUserToken: boolean = false): Observable<any> {
    return this.request('GET', `${type}s/${id}`, {}, useUserToken);
  }

  getUserProfile(): Observable<any> {
    return this.request('GET', 'me', {}, true);
  }

  getUserPlaylists(): Observable<any> {
    return this.request('GET', 'me/playlists', {}, true);
  }

  getPlaylistDetails(playlistId: string): Observable<any> {
    return this.request('GET', `playlists/${playlistId}`, {}, true);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}