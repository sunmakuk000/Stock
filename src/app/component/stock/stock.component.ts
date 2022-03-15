import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CenterFnService } from 'src/app/service/center-fn.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SWAlertService } from 'src/app/service/swalert.service';
import { async } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private router: Router, private System: CenterFnService, private _ActivatedRoute: ActivatedRoute) { }
  diaplayCss = this.System.checkByNgmodal;
  FieldInValidNgModal = this.System.FieldInValidNgModal;
  ArrProduct: any = [];
  ArrItem: any = [];
  login: any = 0;
  role: any = 1;
  productItem = {
    ProductName: "",
    ProductId: "",
    Type: "",
    Price: "",
    Volume: 0,
    Brand: "",
    Package: "",
    Description: "",
    InStock: "",
  }
  validate = {
    ProductName: false,
    Volume: false,
  }
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "5%" },
    { ColumnName: "ชื่อสินค้า", SortField: "", Width: "30%" },
    { ColumnName: "จำนวน", SortField: "", Width: "10%" },
    { ColumnName: "จำนวนในคลัง", SortField: "", Width: "15%" },
    { ColumnName: "จำนวนสินค้าทั้งหมด", SortField: "", Width: "15%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  api = {
    getCustomer: environment.API_URL+"getCustomer",
    getProvinces: environment.API_URL+"getProvinces",
    getAmphures: environment.API_URL+"getAmphures",
    getDistricts: environment.API_URL+"getDistricts",
    getProduct: environment.API_URL+"getBillProduct",
    getVattype: environment.API_URL+"getVattype",
    getProductEdit: environment.API_URL+"getEditBill",
    addBill: environment.API_URL+"ceateBill",
    EditBill: environment.API_URL+"editBill",
    approve: environment.API_URL+"approveBill"
  }
  ngOnInit(): void {
    this.GetautoComplate();
    this.System.CheckSession();
    this.role = localStorage.getItem('role');
    this.login = localStorage.getItem('id');
  }
  ProductChange(item) {
    let _this = this;
    _this.productItem.Volume = null;
    _this.productItem.ProductId = item.item.id;
    _this.productItem.Type = item.item.type;
    _this.productItem.Price = item.item.price
    _this.productItem.Brand = item.item.brand
    _this.productItem.Package = item.item.packaging_type
    _this.productItem.Description = item.item.description
    _this.productItem.InStock = item.item.instock_now
  }
  AddItem() {
    let _this = this;
    let pass = true;
    let field = ["ProductName"];
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.productItem[e], 'string')) {
        this.validate[e] = false;
      } else {
        this.validate[e] = true;
        pass = false;
      }
    });
    if (pass) {
      let chk = _this.ArrItem.filter(f => f.ProductId == _this.productItem.ProductId && f.Isdel != true);
      if (chk.length == 0) {
        let lstData = this.ArrItem;
        let _Data = {
          ProductName: _this.productItem.ProductName,
          ProductId: _this.productItem.ProductId,
          Volume: _this.productItem.Volume,
          InStock: _this.productItem.InStock,
          TotalStock: _this.productItem.InStock,
          Isdel: false,
        }
        _this.ArrItem.push(_Data);
        this.clearitem();
        console.log(_this.ArrItem);
      } else {
        _this.SW.SwAlert.Warning(_this.SW.BoxMsg.Title_Warning, _this.SW.BoxMsg.Dec_Data_Dup, undefined);
        return false;
      }
    }
  }
  async SaveAddStock() {
    let _this = this;
    let pass = true;
    _this.ArrItem.forEach(e => {
      if (!this.FieldInValidNgModal(e.Volume, 'number')) {
        this.validate["Volume"] = false;
      } else {
        this.validate["Volume"] = true;
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
        let arrSuccess = [];
        _this.ArrItem.forEach(async f => {
          let _Data = {
            stock_result: +f.TotalStock,
            id: f.ProductId,
            stock_num: +f.Volume,
            sale_id: _this.login,
          }
          let ITEM = JSON.stringify(_Data);
          await _this.http.post(environment.API_URL+"addStock", ITEM, headers).toPromise().then(data => {
            if (data) {
              arrSuccess.push(data);
            }
          }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
          if (arrSuccess.length == _this.ArrItem.length) {
            _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
              _this.productItem = {
                ProductName: "",
                ProductId: "",
                Type: "",
                Price: "",
                Volume: 0,
                Brand: "",
                Package: "",
                Description: "",
                InStock: "",
              };
              _this.ArrItem = [];
            })

          }
        });
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    }

  }
  DelItem(id) {
    let _this = this;
    let Data = this.ArrItem.filter(f => f.ProductId == id);
    let index = this.ArrItem.findIndex(f => f.ProductId == id);
    this.ArrItem.splice(index, 1);
  }
  async GetautoComplate() {
    let _this = this;
    let lstData: any;
    //Product 
    await _this.http.get(_this.api.getProduct, { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrProduct = lstData;
      } else {
        _this.ArrProduct = [];
      }
    });
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
  onVolumeBlur(index, item, key) {
    let readd = index[key]
    if (readd != null && readd != "") {
      if (readd[0] == "0") {
        index[key] = null;
      } else {
        index[key] = Number(item.target.value);
      }
    }
    this.CalStock()
  }
  typeaheadOnBlur(item, arr, search) {
    if (arr.length > 0) {
      let data = arr.filter(f => f[search] == item.value);
      if (data.length > 0) {
        this.ProductChange(item)
      } else {
        this.productItem = {
          ProductName: "",
          ProductId: "",
          Type: "",
          Price: "",
          Volume: 0,
          Brand: "",
          Package: "",
          Description: "",
          InStock: "",
        }
      }
    }
  }
  clearitem() {
    this.productItem = {
      ProductName: "",
      ProductId: "",
      Type: "",
      Price: "",
      Volume: null,
      Brand: "",
      Package: "",
      Description: "",
      InStock: "",
    }
  }
  CalStock() {
    this.ArrItem.forEach(f =>
      f.TotalStock = (Number(f.InStock) + Number(f.Volume)));
  }
}
