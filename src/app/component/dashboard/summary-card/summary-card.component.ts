import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from 'src/app/service/dashboard-data.service';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  constructor(public data: DashboardDataService) { }

  ngOnInit(): void {
    this.data.initial_card();
  }

}
