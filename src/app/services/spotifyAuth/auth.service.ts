import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = '1a4cabadab9a4d96ac5356d3f92b23fe';
  private clientSecret = '04c669a207c748eca6dc7f72f3a18414';
  private redirectUri = 'http://localhost:4200/callback';
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';
  private scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-email user-read-private playlist-read-private playlist-read-collaborative';
  private tokenKey = 'spotify_token';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const authUrl = `${this.authEndpoint}?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scopes)}`;
    window.location.href = authUrl;
  }

  getToken(code: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
    });

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    }).toString();

    return this.http.post(this.tokenEndpoint, body, { headers });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  handleCallback(): void {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.getToken(code).subscribe({
        next: (response) => {
          const token = response.access_token;
          this.saveToken(token);
          this.router.navigate(['/logged']);
        },
        error: (error) => {
          console.error('Error al obtener el token', error);
        }
      });
    }
  }

  getTokenObservable(): Observable<string | null> {
    return of(this.getTokenFromStorage());
  }
}
