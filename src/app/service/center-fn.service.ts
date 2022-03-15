import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SWAlertService } from './swalert.service';

@Injectable({
  providedIn: 'root'
})
export class CenterFnService {

  constructor(private SW: SWAlertService, private router: Router) { }
  CheckPermission() {
    let _this = this;
    let user = localStorage.getItem('role');
    if (user == "1") {

    } else {
      _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, "ไม่ได้รับอนุญาต", function () { _this.router.navigate(['/Dashboard']) })

    }
  }
  CheckSession() {
    let hours = 1; // Reset when storage is more than 24hours
    let now = new Date().getTime();
    let _this = this;
    let user = localStorage.getItem('setupTime');
    if (user != null) {
      if (Number(now) - Number(user) > hours * 60 * 60 * 1000) {
        localStorage.clear()
        _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, "Session Time Out", function () { _this.router.navigate(['/login']) })

      }
    } else {
      _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, "Session Time Out", function () { _this.router.navigate(['/login']) })
    }
  }
  checkByNgmodal(field, Type, isAction) {
    let _this = this;
    let sClass = "";
    if (isAction) {
      if (_this.FieldInValidNgModal(field, Type) == false) {
        sClass = "has-feedback";
      } else {
        sClass = "has-error";
      }
    } else {
      sClass = "has-feedback";
    }
    return sClass
  }
  FieldInValidNgModal(field, Type) {
    let valid = false;
    if (Type == "string") {
      if (field == "-1") {
        field = "";
      }
      if (typeof field === "number") {
        field = "";
      }
      if (field && field != "null") {
        valid = false;
      } else {
        valid = true;
      }
    }
    if (Type == "Email") {
      var regExp = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}', 'g');
      var test = regExp.test(field)
      if (test) {
        valid = false;
      } else {
        valid = true;
      }
    }
    if (Type == "number") {
      if (typeof field === "number") {
        if (field == null) {
          valid = true;
        } else {
          valid = false;
        }
      } else {
        valid = true;
      }
    }
    return valid;
  }
}
