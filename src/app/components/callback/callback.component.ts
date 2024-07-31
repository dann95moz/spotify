// src/app/components/callback/callback.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/spotifyAuth/auth.service';

@Component({
  selector: 'app-callback',
  template: '<p>Loading...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
 this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authService.getToken(code).subscribe(response => {
          const token = response.access_token;
          this.authService.saveToken(token);
          window.location.href = '/login'; // Redirige a tu página principal
        }, error => {
          console.error('Error al obtener el token', error);
        });
      }
    });
  }
}
