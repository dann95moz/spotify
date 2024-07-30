import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TokenResponse } from './token.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '1a4cabadab9a4d96ac5356d3f92b23fe';
  private clientSecret = '04c669a207c748eca6dc7f72f3a18414';
  private token: string = '';
  private tokenExpirationTime: number = 0;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  private authenticate(): Observable<void> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials');
  
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    return this.http.post<TokenResponse>('https://accounts.spotify.com/api/token', body, { headers })
      .pipe(
        map(response => {
          this.token = response.access_token;
          this.tokenExpirationTime = Date.now() + (response.expires_in * 1000);
        }),
        catchError(this.handleError)
      );
  }

  private ensureTokenValid(): Observable<void> {
    if (!this.token || Date.now() > this.tokenExpirationTime) {
      return this.authenticate();
    }
    return EMPTY;
  }

  search(query: string, type: string = 'track,artist,album'): Observable<any> {
    return this.ensureTokenValid().pipe(
      switchMap(() => {
        const params = new HttpParams()
          .set('q', query)
          .set('type', type);

        return this.http.get('https://api.spotify.com/v1/search', { headers: this.getHeaders(), params });
      }),
      catchError(this.handleError)
    );
  }

  getDetails(type: string, id: string): Observable<any> {
    return this.ensureTokenValid().pipe(
      switchMap(() => {
        return this.http.get(`https://api.spotify.com/v1/${type}s/${id}`, { headers: this.getHeaders() });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}