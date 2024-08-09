import { Observable, switchMap } from 'rxjs';
import { Component} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SpotifyService } from '@services/api/spotify.service';
import { AlbumElement, ArtistsItem, TracksItem } from '@services/api/search.interface';
import { MatCardModule } from '@angular/material/card';

type SpotifyItem = AlbumElement | ArtistsItem | TracksItem;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatProgressSpinner, AsyncPipe, MatCardModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  details$: Observable<SpotifyItem>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService,
  ) {
    this.details$ = this.route.params.pipe(
      switchMap(params => this.spotifyService.getDetails(params['type'], params['id'])))
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

 
}
