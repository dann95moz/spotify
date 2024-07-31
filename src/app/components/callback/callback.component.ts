// src/app/components/callback/callback.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/spotifyAuth/auth.service';

@Component({
  selector: 'app-callback',
  template: '<p>Loading...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
   console.log('callback params',params);
   this.authService.handleCallback();
    });
  }
}
