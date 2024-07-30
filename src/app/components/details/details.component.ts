import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatToolbar, MatIcon,NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  details: any;
  @ViewChild('audio', { static: true }) audio!: ElementRef<HTMLAudioElement>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) { }
  async ngOnInit() {
    const { type, id } = this.route.snapshot.params;
    this.details = await this.spotifyService.getDetails(type, id);
  }
  goBack() {
    this.router.navigate(['/']);
  }
  playPreview() {
    this.audio.nativeElement.play();
  }
}
