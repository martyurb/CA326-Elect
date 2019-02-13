import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-poll',
  templateUrl: './view-poll.component.html',
  styleUrls: ['./view-poll.component.css']
})
export class ViewPollComponent implements OnInit {

  private title;
  private options;
  private id;
  pollFound: boolean;

  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute
            ) { }

  ngOnInit() {
    let pollid = this.route.snapshot.paramMap.get('id');
    console.log(pollid);
    this.authService.getPollInformation(pollid)
      .subscribe((response) => {
        this.title = response.title;
        this.options = response.options;
        this.id = response.id;
        this.pollFound = true;
      });
  }

}
