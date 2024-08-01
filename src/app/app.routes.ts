
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './components/callback/callback.component';
import { LoggedComponent } from './components/logged/logged.component';
import { PlaylistDetailsComponent } from './components/playlist-details/playlist-details.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details/:type/:id', component: DetailsComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'logged', component: LoggedComponent },
    {path:'logged/playlist/:playlistId', component: PlaylistDetailsComponent},
    { path: '**', redirectTo:''}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }