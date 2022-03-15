import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SWAlertService } from 'src/app/service/swalert.service';
import { environment } from 'src/environments/environment';
import { CenterFnService } from 'src/app/service/center-fn.service';

@Component({
  selector: 'app-add-pakage',
  templateUrl: './add-pakage.component.html',
  styleUrls: ['./add-pakage.component.css']
})
export class AddPakageComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService,private System: CenterFnService) { }
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "10%" },
    { ColumnName: "ชื่อ", SortField: "", Width: "75%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  Pakage = {
    id: "",
    name: ""
  }
  page = 1;
  pageSize = 10;
  modeAdd: any = true;
  arrPakage: any = [];
  ngOnInit(): void {
    this.GetPakage();
    this.System.CheckSession();
    this.System.CheckPermission();
  }
  addModel(Insert: TemplateRef<any>) {  //เปิด PopUp
    this.Pakage = {
      id: "",
      name: ""
    }
    let _this = this;
    _this.modeAdd = true;
    const config: ModalOptions = { class: 'gray modal-lg' };
    this.modalRef = this.modalService.show(Insert, config);
  }
  Save() {
    let _this = this;
    let result: any;
    let save = function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = { title: _this.Pakage.name }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL+"addPackagingType", ITEM, headers).subscribe(data => {
        if (data) {

          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetPakage();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
  async GetPakage() {
    let _this = this;
    await _this.http.get(environment.API_URL+"getPackagingType").toPromise().then(data => {
      _this.arrPakage = data;
    }
    )
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
      _this.http.post(environment.API_URL+"deletePackagingType", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.GetPakage();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  Edit(Insert: TemplateRef<any>, id) {
    let _this = this;
    _this.modeAdd = false;
    let Data = _this.arrPakage.filter(f => f.id == id);
    if (Data) {
      this.Pakage.name = Data[0].title;
      this.Pakage.id = Data[0].id;
      const config: ModalOptions = { class: 'gray modal-lg' };
      this.modalRef = this.modalService.show(Insert, config);
    }
  }
  SaveEdit() {
    let _this = this;
    let result: any;
    let save = function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = {
        id: _this.Pakage.id,
        title: _this.Pakage.name
      }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL+"editPackagingType", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetPakage();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
}
