import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-poll',
  templateUrl: './view-poll.component.html',
  styleUrls: ['./view-poll.component.css']
})
export class ViewPollComponent implements OnInit {

  private title;
  private options;
  public id;
  pollFound: boolean;
  isOpen: Boolean;

  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  ngOnInit() {
    const pollid = this.route.snapshot.paramMap.get('id');
    console.log(pollid);
    this.authService.getPollInformation(pollid)
      .subscribe((response) => {
        this.title = response.title;
        this.options = response.options;
        this.id = response.id;
        this.pollFound = true;

        if (response.isOpen === false) {
          this.router.navigate(['/poll', this.id, 'result']);
        }
      });
  }

  // copied from user polls component
  copy() {
    const pollid = this.route.snapshot.paramMap.get('id');
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
