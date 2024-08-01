import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TokenResponse } from './token.interface';
import { SpotifySearch } from './search.interface';
import { AuthService } from '../spotifyAuth/auth.service';
import { PlayList } from './playList.interface';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient],
})
export class SpotifyService {
  public clientId = '1a4cabadab9a4d96ac5356d3f92b23fe';
  public clientSecret = '04c669a207c748eca6dc7f72f3a18414';
  private clientToken: string = '';
  private clientTokenExpirationTime: number = 0;
  private userToken: string | null = null;
  private apiUrl = 'https://api.spotify.com/v1';
  private userUri = 'https://api.spotify.com/v1/me'
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getClientHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.clientToken}`
    });
  }

  private getUserHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.userToken}`
    });
  }

  private authenticateClient(): Observable<void> {
    const body = new HttpParams().set('grant_type', 'client_credentials');
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>('https://accounts.spotify.com/api/token', body, { headers })
      .pipe(
        map(response => {
          this.clientToken = response.access_token;
          this.clientTokenExpirationTime = Date.now() + (response.expires_in * 1000);
        }),
        catchError(this.handleError)
      );
  }

  private ensureClientTokenValid(): Observable<void | null> {
    if (!this.clientToken || Date.now() > this.clientTokenExpirationTime) {
      return this.authenticateClient();
    }
    return of(null);
  }

  private ensureUserTokenValid(): Observable<void | null> {
    return this.authService.getTokenObservable().pipe(
      switchMap(token => {
        if (!token) {
          return throwError(() => new Error('User token is invalid or expired.'));
        }
        this.userToken = token;
        return of(null);
      })
    );
  }

  private ensureTokenValid(user: boolean): Observable<void | null> {
    return user ? this.ensureUserTokenValid() : this.ensureClientTokenValid();
  }

  search(query: string, type: string = 'track,artist,album', user: boolean = false): Observable<any> {
    return this.ensureTokenValid(user).pipe(
      switchMap(() => {
        const params = new HttpParams().set('q', query).set('type', type);
        const headers = user ? this.getUserHeaders() : this.getClientHeaders();
        return this.http.get<SpotifySearch>('https://api.spotify.com/v1/search', { headers, params });
      }),
      catchError(this.handleError)
    );
  }

  getDetails(type: string, id: string, user: boolean = false): Observable<any> {
    return this.ensureTokenValid(user).pipe(
      switchMap(() => {
        const headers = user ? this.getUserHeaders() : this.getClientHeaders();
        return this.http.get(`https://api.spotify.com/v1/${type}s/${id}`, { headers });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  getUserProfile(): Observable<any> {
    return this.ensureTokenValid(true).pipe(
      switchMap(() => {
        return this.http.get(this.userUri, { headers: this.getUserHeaders() });
      }),
      catchError(this.handleError)
    );
  }
  getUserPlaylists(): Observable<PlayList> {

    return this.ensureTokenValid(true).pipe(
      switchMap(() => {
        return this.http.get<PlayList>(`${this.apiUrl}/me/playlists`, { headers: this.getUserHeaders() }).pipe(tap(console.log))      }),
      catchError(this.handleError)
    );

 

  }
  
}
