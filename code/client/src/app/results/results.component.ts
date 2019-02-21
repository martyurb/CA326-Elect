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
