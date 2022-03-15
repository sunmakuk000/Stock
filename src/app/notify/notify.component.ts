import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {
  ArrLowStock: any = [];
  constructor( private bsModalRef: BsModalRef,private http: HttpClient) { }
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "5%" },
    { ColumnName: "ชื่อสินค้า", SortField: "", Width: "30%" },
    { ColumnName: "คงเหลือในคลัง", SortField: "", Width: "15%" },
  ]
  ngOnInit(): void {
    let _this =this;
    _this.http.get(environment.API_URL + "notifyStock", { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrLowStock = lstData;
      } else {
        _this.ArrLowStock = [];
      }
    });
  }
  close() {
   
    this.bsModalRef.hide();
}
}
