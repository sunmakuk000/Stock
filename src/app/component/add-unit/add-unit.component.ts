import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SWAlertService } from 'src/app/service/swalert.service';
import { environment } from 'src/environments/environment';
import { CenterFnService } from 'src/app/service/center-fn.service';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css']
})
export class AddUnitComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private System: CenterFnService) { }
  Columns = [
    { ColumnName: "ID", SortField: "", Width: "10%" },
    { ColumnName: "ชื่อเรียกหน่วย", SortField: "", Width: "75%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  Unit = {
    id: "",
    name: ""
  }
  modeAdd: any = true;
  arrUnit: any = [];
  ngOnInit(): void {
    this.System.CheckSession();
    this.GetUnit();
  }
  addModel(Insert: TemplateRef<any>) {  //เปิด PopUp
    this.Unit = {
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
      let _Data = { title: _this.Unit.name }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL+"addUnitType", ITEM, headers).subscribe(data => {
        if (data) {

          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetUnit();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
  async GetUnit() {
    let _this = this;
    await _this.http.get(environment.API_URL+"getUnitType").toPromise().then(data => {
      _this.arrUnit = data;
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
      _this.http.post(environment.API_URL+"deleteUnitType", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.GetUnit();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  Edit(Insert: TemplateRef<any>, id) {
    let _this = this;
    _this.modeAdd = false;
    let Data = _this.arrUnit.filter(f => f.id == id);
    if (Data) {
      this.Unit.name = Data[0].title;
      this.Unit.id = Data[0].id;
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
        id: _this.Unit.id,
        title: _this.Unit.name
      }
      let ITEM = JSON.stringify(_Data);
      _this.http.post(environment.API_URL+"editBrand", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetUnit();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
}