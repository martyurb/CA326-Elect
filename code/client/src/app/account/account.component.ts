import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public userData;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    // Get the users profile
    this.authService.getProfile()
      .subscribe((userData) => {
        console.log(userData);
        this.userData = userData;
      }); 
  }

}
