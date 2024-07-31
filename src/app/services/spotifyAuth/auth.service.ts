// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SpotifyService } from '../api/spotify.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = '';
  private redirectUri = 'http://localhost:4200/callback';
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';

  constructor(private http: HttpClient, private spotifyService: SpotifyService) {
    this.clientId = spotifyService.clientId
  }

  login() {
    const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
    const authUrl = `${this.authEndpoint}?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    
    window.location.href = authUrl;
  }

  getToken(code: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.spotifyService.clientSecret)
    });

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    }).toString();

    return this.http.post(this.tokenEndpoint, body, { headers });
  }
  saveToken(token: string): void {
    localStorage.setItem('spotify_token', token);
  }
}
