import { Component } from '@angular/core';
import { AuthService } from '../../services/spotifyAuth/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'login-button',
  standalone: true,
  imports: [  MatButtonModule],
  templateUrl: './login-btn.component.html',
  styleUrl: './login-btn.component.scss'
})
export class LoginBtnComponent {
  constructor( private authService: AuthService) {
    
  }
  login() {
    this.authService.login();
  }
}
