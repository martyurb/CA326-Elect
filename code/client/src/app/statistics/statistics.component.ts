import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  private title;
  // lineChart
  public lineChartType = 'line';
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = ['0', '1', '2', '3', '4', '5', '6', '7'];
  public lineChartOptions: any = {
    responsive: true

  };

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'doughnut';
  public pieChartOptions = {
    legend: {
      position: 'right',
      onClick: false
    },
  };
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        '#eb8385',
        '#7ebbde',
        '#f0d18d',
        '#85c9c9',
        '#de7edb',
        '#93de7e',
        '#53678a',
      ]
    }
  ];

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

    this.authService.getResults(pollid).subscribe((response) => {
      console.log(response.grouped);
      const keyarr = [];
      const valarr = [];

      for (let i = 0; i < Object.keys(response.grouped).length; i++) {
        const key = Object.keys(response.grouped)[i];
        this.pieChartLabels.push(key);
        valarr.push(response.grouped[key]);
      }
      this.pieChartData = valarr;

      console.log('here', keyarr);
      console.log(valarr);

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
      //moved from view poll component
      this.authService.getPollInformation(pollid)
        .subscribe((response) => {
          this.title = response.title;
      });
  }

}
