import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerService } from './services/player/player.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(private playerService: PlayerService) { }
  ngOnInit(): void {
    // Inicializa el reproductor cuando se cargue el componente principal
    this.playerService.initializePlayer();
  }
}
