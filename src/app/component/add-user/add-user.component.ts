import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SWAlertService } from 'src/app/service/swalert.service';
import { CenterFnService } from 'src/app/service/center-fn.service';
import { environment } from 'src/environments/environment';
import { async } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private System: CenterFnService) { }
  diaplayCss = this.System.checkByNgmodal;
  FieldInValidNgModal = this.System.FieldInValidNgModal;
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "10%" },
    { ColumnName: "ชื่อ-สกุล", SortField: "", Width: "25%" },
    { ColumnName: "UserName", SortField: "", Width: "20%" },
    { ColumnName: "เบอร์โทร", SortField: "", Width: "20%" },
    { ColumnName: "", SortField: "", Width: "10%" }
  ]
  page = 1;
  pageSize = 10;
  modeAdd: boolean = true;
  validate = {
    UserId: false,
    FistName: false,
    LastName: false,
    NickName: false,
    Role: false,
    UserName: false,
    PassWord: false,
  }
  User = {
    UserId: "",
    FistName: "",
    LastName: "",
    NickName: "",
    Phone: "",
    Role: "",
    UserName: "",
    PassWord: "",
    ConfirmPassword: ""
  }
  arrUser: any = [];
  ngOnInit(): void {
    this.GetUser();
    this.System.CheckPermission()
    this.System.CheckSession();
  }
  Save(mode) {
    let _this = this;
    if (mode == 1) { // Add
      let pass = true;
      let field = ["FistName", "LastName", "NickName", "UserName", "PassWord", "Role"];
      field.forEach(e => {
        if (!this.FieldInValidNgModal(this.User[e], 'string')) {
          this.validate[e] = false;
        } else {
          this.validate[e] = true;
          pass = false;
        }
      });
      if (pass) {
        let result: any;
        let save = async function () {
          const headers = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };
          let _Data = {
            username: _this.User.UserName,
            password: +_this.User.PassWord,
            phone: +_this.User.Phone,
            first_name: _this.User.FistName,
            last_name: _this.User.LastName,
            play_name: _this.User.NickName,
            role: +_this.User.Role
          }
          let ITEM = JSON.stringify(_Data);
        await  _this.http.post(environment.API_URL + "addUser", ITEM, headers).toPromise().then(data => {
            if (data) {

              _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
                _this.modalRef.hide();
                _this.GetUser();
              })

            }
          }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
        }
        _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
      }
    }
    if (mode == 2) { // Edit
      let result: any;
      let pass = true;
      let field = ["FistName", "LastName", "NickName", "UserName", "PassWord"];
      field.forEach(e => {
        if (!this.FieldInValidNgModal(this.User[e], 'string')) {
          this.validate[e] = false;
        } else {
          this.validate[e] = true;
          pass = false;
        }
      });
      if (pass) {
        let save = async function () {
          const headers = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };
          let _Data = {
            id: +_this.User.UserId,
            username: _this.User.UserName,
            password: +_this.User.PassWord,
            phone: +_this.User.Phone,
            first_name: _this.User.FistName,
            last_name: _this.User.LastName,
            play_name: _this.User.NickName,
            role: +_this.User.Role
          }
          let ITEM = JSON.stringify(_Data);
          await _this.http.post(environment.API_URL + "editUser", ITEM, headers).toPromise().then(data => {
            if (data) {

              _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
                _this.GetUser();
                _this.modalRef.hide();
              })

            }
          }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
        }
        _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
      }
    }
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
      _this.http.post(environment.API_URL + "deleteUser", ITEM, headers).subscribe(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.GetUser();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  Edit(Insert: TemplateRef<any>, id) {
    let _this = this;
    _this.modeAdd = false;
    let Data = _this.arrUser.filter(f => f.id == id);
    if (Data) {

      this.User.FistName = Data[0].first_name;
      this.User.LastName = Data[0].last_name;
      this.User.NickName = Data[0].play_name;
      this.User.Role = Data[0].role;
      this.User.UserId = Data[0].id;
      this.User.Phone = Data[0].phone;
      this.User.UserName = Data[0].username;


      const config: ModalOptions = { class: 'gray modal-lg' };
      this.modalRef = this.modalService.show(Insert, config);
    }
  }
  addModel(Insert: TemplateRef<any>) {
    this.validate = {
      UserId: false,
      FistName: false,
      LastName: false,
      NickName: false,
      Role: false,
      UserName: false,
      PassWord: false,
    }
    this.User = {
      UserId: "",
      FistName: "",
      LastName: "",
      NickName: "",
      Phone: "",
      Role: "",
      UserName: "",
      PassWord: "",
      ConfirmPassword: ""
    }
    let _this = this;
    _this.modeAdd = true;
    const config: ModalOptions = { class: 'gray modal-lg' };
    this.modalRef = this.modalService.show(Insert, config);
  }
  async GetUser() {
    let _this = this;
    let results: any;
    await _this.http.get(environment.API_URL + "getUser").toPromise().then(data => {
      results = data;
    })
    _this.arrUser = results.data;
  }
  CheckPatternNodot(event) {
    const charCode = event.key;
    if (charCode != "Backspace") {
      var regExp = new RegExp('[0-9]', 'g');
      if (regExp.test(charCode)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
