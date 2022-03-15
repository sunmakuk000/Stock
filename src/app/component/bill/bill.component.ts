import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SWAlertService } from 'src/app/service/swalert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CenterFnService } from 'src/app/service/center-fn.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  modeAdd: boolean = false;
  modalRef: BsModalRef;


  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private router: Router, public datepipe: DatePipe, private System: CenterFnService) { }
  page = 1;
  pageSize = 10;
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "5%" },
    { ColumnName: "ชื่อลูกค้า", SortField: "", Width: "28%" },
    { ColumnName: "วันที่", SortField: "", Width: "18%" },
    { ColumnName: "มีภาษี", SortField: "", Width: "10%" },
    { ColumnName: "สถานะ", SortField: "", Width: "12%" },
    { ColumnName: "ราคารวม(THB)", SortField: "", Width: "15%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ];
  search = {
    sDate: [],
    sStatus: null,
    sSearch: null,
    sVatType: null,
  }
  /*arrBill = {
    id:"",
    Name:"",
    Date:"",
    Vat:"",
    Totalamount: "",
  }*/
  arrBill: any = [];
  ngOnInit(): void {
    this.GetBill();
    this.System.CheckSession()
  }
  addModel(Insert: TemplateRef<any>) {  //เปิด PopUp

    let _this = this;
    _this.modeAdd = true;
    const config: ModalOptions = { class: 'gray modal-lg' };
    this.modalRef = this.modalService.show(Insert, config);
  }
  async Save() {
    let _this = this;
    let result: any;
    let save = async function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = {

      }
      let ITEM = JSON.stringify(_Data);
      await _this.http.post(environment.API_URL + "addProduct", ITEM, headers).toPromise().then(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
          })

        }
      }, error => { console.log(error); _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
  async Search() {
    await this.GetBill();

    if (this.search.sSearch != null && this.search.sSearch != "") {
      var search = new RegExp(this.search.sSearch, 'i'); // prepare a regex object
      this.arrBill = this.arrBill.filter(item => search.test(item.company_name));
    }
    if (this.search.sDate.length > 0) {
      let s = new Date(this.arrBill[0].bill_raw_Date).setTime(0);
      this.arrBill = this.arrBill.filter(f => (new Date(f.bill_raw_Date) >= this.SetDay(this.search.sDate[0]) && new Date(f.bill_raw_Date) <= this.SetDay(this.search.sDate[1])))
    }
    if (this.search.sStatus != null && this.search.sStatus != "null") {
      this.arrBill = this.arrBill.filter(f => f.approve_status == this.search.sStatus);
    }
    if (this.search.sVatType != null && this.search.sVatType != "null") {
      this.arrBill = this.arrBill.filter(f => f.vat_type == this.search.sVatType);
    }

  }
  async GetBill() {
    let _this = this;
    let lstData: any;
    await _this.http.get(environment.API_URL + "getBill").toPromise().then(data => {
      if (data) {
        lstData = data;
        _this.arrBill = lstData.data
      } else {

      }
    })
  }
  PDF(id) {
    let lstData = this.arrBill.filter(f => f.id == id);
    const link = document.createElement('a');
    link.target = '_blank'
    // link.href = this.System.SiteName + "api/ExportPDF/export/" + this.sReqID + "/" + this.paytovendorForm.get("nContactID").value;
    link.href = "http://shopbenjamas.com/report/?bill_number=" + lstData[0].bill_number;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }
  async ClearSearch() {
    this.search = {
      sDate: [],
      sStatus: null,
      sSearch: null,
      sVatType: null,
    }
    await this.GetBill();

  }
  Delete(Id) {
    let _this = this;
    let result: any;
    let save = function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = { id: Id }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL + "deleteProduct", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.GetBill();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  async Edit(id) {
    let _this = this;
    _this.router.navigate(['/Create-Bill'], { queryParams: { ID: CryptoJS.AES.encrypt(id.toString(), "id").toString() } });

  }
  SaveEdit(id) {
    let _this = this;
    let result: any;
    let save = function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = {

      }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL + "editProduct", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetBill();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
  SetDay(Day: Date): Date {
    let _this = this;
    let sDate = new Date(_this.datepipe.transform(Day, "yyyy-MM-dd"));
    return sDate;
  }
}
