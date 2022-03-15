import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SWAlertService } from '../service/swalert.service';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private user: UserService, private SW: SWAlertService, private router: Router) { }

  async login(username: String, password: String) {
    let hours = 1; // Reset when storage is more than 24hours
    let now = new Date().getTime();
    let _this = this;
    await this.http.post<any>(environment.API_URL + 'signIn', { username: username, password: password }, environment.httpOptions).toPromise().then(res => {
      if (res.status == 200) {
        localStorage.setItem("id", res.data.Id);
        localStorage.setItem("first_name", res.data.first_name);
        localStorage.setItem("last_name", res.data.last_name);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("permission", res.data.permission);
        this.router.navigate(['Dashboard']);
        var setupTime = localStorage.getItem('setupTime');
        if (setupTime == null) {
          localStorage.setItem('setupTime', now + "")
        } else {
          if (Number(now) - Number(setupTime) > hours * 60 * 60 * 1000) {
            localStorage.clear()
          }
        }
        return true
      } else { }
    }, error => {
      this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_Warning, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", undefined)
    })

  }
}
