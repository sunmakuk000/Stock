import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { CenterFnService } from 'src/app/service/center-fn.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private System: CenterFnService) { }

  ngOnInit(): void {
    this.System.CheckSession();
  }
}
