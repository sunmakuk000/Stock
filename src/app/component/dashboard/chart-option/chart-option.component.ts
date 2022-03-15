import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from 'src/app/service/dashboard-data.service';

@Component({
  selector: 'app-chart-option',
  templateUrl: './chart-option.component.html',
  styleUrls: ['./chart-option.component.css']
})
export class ChartOptionComponent implements OnInit {

  constructor(public chartdata: DashboardDataService) { }

  ngOnInit(): void {
  }

}
