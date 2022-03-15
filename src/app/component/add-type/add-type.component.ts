import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SWAlertService } from 'src/app/service/swalert.service';
import { CenterFnService } from 'src/app/service/center-fn.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private System: CenterFnService) { }
  diaplayCss = this.System.checkByNgmodal;
  FieldInValidNgModal = this.System.FieldInValidNgModal;
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "10%" },
    { ColumnName: "ชื่อ", SortField: "", Width: "75%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  validate = {
    name: false
  }
  Type = {
    id: "",
    name: ""
  }
  page = 1;
  pageSize = 10;
  modeAdd: any = true;
  arrType: any = [];
  ngOnInit(): void {
    this.GetType();
    this.System.CheckPermission()
    this.System.CheckSession();
  }
  addModel(Insert: TemplateRef<any>) {  //เปิด PopUp
    this.validate = {
      name: false
    }
    this.Type = {
      id: "",
      name: ""
    }
    let _this = this;
    _this.modeAdd = true;
    const config: ModalOptions = { class: 'gray modal-md' };
    this.modalRef = this.modalService.show(Insert, config);
  }
  Save() {
    let _this = this;
    let result: any;
    let pass = true;
    let field = ["name"];
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.Type[e], 'string')) {
        this.validate[e] = false;
      } else {
        this.validate[e] = true;
        pass = false;
      }
    });
    if (pass) {
      let save = function () {
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        let _Data = { title: _this.Type.name }
        let ITEM = JSON.stringify(_Data);
        _this.http.post(environment.API_URL+"addType", ITEM, headers).subscribe(data => {
          if (data) {

            _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
              _this.modalRef.hide();
              _this.GetType();
            })

          }
        }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    }
  }
  async GetType() {
    let _this = this;
    await _this.http.get(environment.API_URL+"getType").toPromise().then(data => {
      _this.arrType = data;
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
      _this.http.post(environment.API_URL+"deleteType", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.GetType();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  Edit(Insert: TemplateRef<any>, id) {
    let _this = this;
    _this.modeAdd = false;
    this.validate = {
      name: false
    }
    let Data = _this.arrType.filter(f => f.id == id);
    if (Data) {
      this.Type.name = Data[0].title;
      this.Type.id = Data[0].id;
      const config: ModalOptions = { class: 'gray modal-md' };
      this.modalRef = this.modalService.show(Insert, config);
    }
  }
  SaveEdit() {
    let _this = this;
    let result: any;
    let pass = true;
    let field = ["name"];
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.Type[e], 'string')) {
        this.validate[e] = false;
      } else {
        this.validate[e] = true;
        pass = false;
      }
    });
    if (pass) {
      let save = function () {
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        let _Data = {
          id: _this.Type.id,
          title: _this.Type.name
        }
        let ITEM = JSON.stringify(_Data);
        _this.http.post(environment.API_URL+"editType", ITEM, headers).subscribe(data => {
          if (data) {
            _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
              _this.modalRef.hide();
              _this.GetType();
            })

          }
        }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    }
  }
}
