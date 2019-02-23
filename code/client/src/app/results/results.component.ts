import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  // Pie
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'doughnut';
  public pieChartOptions = {
    legend: {
      position: 'right',
      onClick: false
    },
    title: {
      display: true,
      text: 'Vote for Oscars Actress in a leading role #Placeholder',
      fontSize: 17
    }
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

  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const pollid = this.route.snapshot.paramMap.get('id');
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
  }

}
