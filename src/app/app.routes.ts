import { DetailsComponent } from './pages/details/details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoggedComponent } from './pages/logged/logged.component';
import { PlaylistDetailsComponent } from './pages/playlist-details/playlist-details.component';
import { HomeComponent } from './pages/home/home.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:type/:id', component: DetailsComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'logged', component: LoggedComponent },
  { path: 'logged/playlist/:playlistId', component: PlaylistDetailsComponent },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
