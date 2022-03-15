import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardDataService } from 'src/app/service/dashboard-data.service';
import * as moment from 'moment';
@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.css']
})
export class SummaryChartComponent implements OnInit {
  options: {};

  constructor(public data: DashboardDataService) { }

  ngOnInit() {
    this.data.summarys();
  }

}
