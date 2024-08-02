import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// Configura la función global en una parte del ciclo de vida de la aplicación
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

(window as any).onSpotifyWebPlaybackSDKReady = () => {
  // No hagas nada aquí. Deja que PlayerService maneje la inicialización.
};
