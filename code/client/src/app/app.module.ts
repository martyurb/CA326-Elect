import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from "angular-6-social-login-v2";

import { SigninComponent } from './signin/signin.component';

const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent},
  { path: '', component: AppComponent}
]

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("806760707429-k9dkogbv6uh8t41bivm3d8ikt7ia2te3.apps.googleusercontent.com")
      }
    ]
  )
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
