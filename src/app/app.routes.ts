
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateUserComponent } from './components/private-user/private-user.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LoginComponent } from './components/login/login.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details/:type/:id', component: DetailsComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }