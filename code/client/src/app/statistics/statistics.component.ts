import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) { }

  ngOnInit() {
    const pollid = this.route.snapshot.paramMap.get('id');
    this.authService.canAccess(pollid)
      .subscribe((response) => {
        if (response.canAccess === false) {
          this.router.navigate(['/']);
        }
      });

    // Get poll
    this.authService.getPoll(pollid)
      .subscribe((response) => {
        console.log(response.poll);
      });
    // Get poll votes
    this.authService.getVotes(pollid)
      .subscribe((response) => {
        console.log(response.votes);
      });
  }

}
