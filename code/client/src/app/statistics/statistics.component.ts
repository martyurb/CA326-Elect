import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // lineChart
  chartSet = false;
  public lineChartType = 'line';

  // public lineChartData:  = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'},
  // ];
  public lineChartLabels: Array<any> = ['Options 1', 'Option 2', 'Option 3', '3', '4', '5', '6', '7'];
  public lineChartData  = [[3, 346, 60, 4], [8, 76, 6, 90], [7, 35, 220, 110]];
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
        } else {
          this.authService.getStatsLine(pollid).subscribe((data) => {
            console.log('data', data);
            this.lineChartData[0] = [1, 2, 3, 4, 5, 6, 7, 8];
            this.chartSet = true;
            console.log(this.lineChartData);
          });
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
