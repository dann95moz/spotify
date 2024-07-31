import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import {  AsyncPipe } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatProgressSpinner }from '@angular/material/progress-spinner';
import { SpotifyService } from '../../services/api/spotify.service';
import { AlbumElement, ArtistsItem, TracksItem } from '../../services/api/search.interface';

type SpotifyItem= AlbumElement| ArtistsItem | TracksItem

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatProgressSpinner, AsyncPipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent  {
  details$: Observable<SpotifyItem>;
  @ViewChild('audio') audio!: ElementRef<HTMLAudioElement>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {
    this.details$ = this.route.params.pipe(
      switchMap(params => this.spotifyService.getDetails(params['type'], params['id'])),
      tap(console.log)
    );
   
  }

 

  goBack(): void {
    this.router.navigate(['/']);
  }

  playPreview(): void {
    if (this.audio?.nativeElement) {
      this.audio.nativeElement.play();
    }
  }
}