import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login-v2';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthenticationService],
})
export class SigninComponent implements OnInit {

  constructor(
    private socialAuthService: AuthService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  // Login/Signup the user via Google OAuth API
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if(socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        this.authService.login(userData.email, userData.name, userData.image, userData.idToken, userData.id);
      }
    );
  }

}
