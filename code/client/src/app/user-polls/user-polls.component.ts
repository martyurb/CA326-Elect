import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-polls',
  templateUrl: './user-polls.component.html',
  styleUrls: ['./user-polls.component.css']
})
export class UserPollsComponent implements OnInit {

  userPollsFound = false;
  userPolls: any;

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.authService.getPolls().subscribe((response) => {
      console.log(response);
      if (response.message === true) {
        this.userPollsFound = true;
        this.userPolls = response.polls;
      }
    });
  }

  goToPoll(pollid: string) {
    console.log(pollid);
    this.router.navigate(['/poll', pollid]);
  }

  goToStats(pollid: string) {
    this.router.navigate(['/poll', pollid, 'statistics']);
  }

  copy(pollid: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = 'http://www.elect-project.com/poll/' + pollid;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
