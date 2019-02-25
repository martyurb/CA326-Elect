import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // lineChart
  public lineChartType = 'line';
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = ['0', '1', '2', '3', '4', '5', '6', '7'];
  public lineChartOptions: any = {
    responsive: true

  };

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



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
    this.authService.getStatsLine(pollid).subscribe((response) => {

        this.lineChartData = response;

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
