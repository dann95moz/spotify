import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  private readonly TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
  private readonly REDIRECT_URI = 'http://localhost:4200/callback';
  private readonly TOKEN_KEY = 'spotify_token';
  private readonly SCOPES = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
  ];

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const authUrl = this.buildAuthUrl();
    window.location.href = authUrl;
  }

  handleCallback(): void {
    const code = this.getCodeFromUrl();
    if (code) {
      this.exchangeCodeForToken(code);
    }
  }

  getTokenObservable(): Observable<string | null> {
    return of(this.getTokenFromStorage());
  }

  private buildAuthUrl(): string {
    if (!environment.spotifyClientId) {
      throw new Error('Spotify Client ID is not defined');
    }

    const params = new URLSearchParams({
      client_id: environment.spotifyClientId,
      response_type: 'code',
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES.join(' '),
    });
    return `${this.AUTH_ENDPOINT}?${params.toString()}`;
  }

  private getCodeFromUrl(): string | null {
    return new URL(window.location.href).searchParams.get('code');
  }

  private exchangeCodeForToken(code: string): void {
    this.getToken(code).subscribe({
      next: (token) => this.handleTokenResponse(token),
      error: (error) => this.handleTokenError(error),
    });
  }

  private getToken(code: string): Observable<string> {
    const headers = this.getTokenHeaders();
    const body = this.getTokenBody(code);

    return this.http.post(this.TOKEN_ENDPOINT, body, { headers }).pipe(
      map((response: any) => response.access_token),
      catchError((error) => {
        console.error('Error al obtener el token', error);
        throw error;
      })
    );
  }

  private getTokenHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(
        `${environment.spotifyClientId}:${environment.spotifyClientSecret}`
      )}`,
    });
  }

  private getTokenBody(code: string): string {
    return new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.REDIRECT_URI,
    }).toString();
  }

  private handleTokenResponse(token: string): void {
    this.saveToken(token);
    this.router.navigate(['/logged']);
  }

  private handleTokenError(error: any): void {
    console.error('Error al obtener el token', error);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
