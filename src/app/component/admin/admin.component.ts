import { Component, OnInit } from '@angular/core';
import { CenterFnService } from 'src/app/service/center-fn.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private System: CenterFnService) { }

  ngOnInit(): void {
    this.System.CheckPermission();
    this.System.CheckSession();
  }

}
