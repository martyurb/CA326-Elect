import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular-6-social-login-v2';

import { AppRoutingModule } from './app-routing.module';

import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { ManageKeysComponent } from './manage-keys/manage-keys.component';
import { HeaderComponent } from './header/header.component';
import { PollComponent } from './poll/poll.component';
import { ViewPollComponent } from './view-poll/view-poll.component';
import { HomeComponent } from './home/home.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { CastVoteComponent } from './cast-vote/cast-vote.component';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('806760707429-k9dkogbv6uh8t41bivm3d8ikt7ia2te3.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    AccountComponent,
    ManageKeysComponent,
    HeaderComponent,
    PollComponent,
    ViewPollComponent,
    HomeComponent,
    UserPollsComponent,
    CastVoteComponent,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
