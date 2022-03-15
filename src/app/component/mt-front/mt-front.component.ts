import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { SWAlertService } from 'src/app/service/swalert.service';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyComponent } from 'src/app/notify/notify.component';

@Component({
  selector: 'app-mt-front',
  templateUrl: './mt-front.component.html',
  styleUrls: ['./mt-front.component.css', '../../../assets/css/_MP_Front.css']
})
export class MtFrontComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService,private http: HttpClient, private user: UserService, private router: Router, private SW: SWAlertService) { }
  openMenu: any = false;
  role: any;
  arrMenu: any = [];
  arr: any = [];
  ngOnInit(): void {
    this.LoadMenu();
    this.role = localStorage.getItem('role');
    this.LowStock();
  }
  SlideMenu() {
    var divBTNSlide = document.getElementById('divBTNSlide');
    var divMenuLeft = document.getElementById('divMenuLeft');
    if (divMenuLeft.style.display == 'none') {
      divMenuLeft.style.display = 'block';
      divBTNSlide.style.display = 'none';
    }
    else {
      divMenuLeft.style.display = 'none';
      divBTNSlide.style.display = 'block';
    }
    var CTRL_adjust_tb_Resize = document.getElementById("adjust_tb_Resize");
    if (CTRL_adjust_tb_Resize) {
      CTRL_adjust_tb_Resize.style.width = "1000px";
      CTRL_adjust_tb_Resize.style.width = (document.getElementById("divResize").clientWidth) + "px";
    }
    var CTRL_divFlowChart = document.getElementById("divFlowChart");
    if (CTRL_divFlowChart) {
      CTRL_divFlowChart.style.width = "1000px";
      CTRL_divFlowChart.style.width = (document.getElementById("divFlowResize").clientWidth) + "px";
    }
  }
  async LoadMenu() {
    await this.http.get(environment.API_URL + "getMenu/" + localStorage.getItem('role') + "", environment.httpOptions).toPromise().then(data => {
      this.arrMenu = data;
    }
    )
  }
  openmenu() {
    this.openMenu = !this.openMenu;
  }
  LowStock() {
    const config: ModalOptions = { class: 'gray modal-lg' };
   
    this.modalRef = this.modalService.show(NotifyComponent,config);

  }
  logout() {
    let _this = this;
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, "คุณต้องการออกจากระบบ", function () {
      localStorage.clear();
      _this.router.navigate(['/login']);

    }, undefined);
  }
}
