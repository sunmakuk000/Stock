import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SWAlertService } from 'src/app/service/swalert.service';
import { CenterFnService } from 'src/app/service/center-fn.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { ExtractPackageComponent } from '../extract-package/extract-package.component';
@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private router: Router, private System: CenterFnService, private _ActivatedRoute: ActivatedRoute) { }
  diaplayCss = this.System.checkByNgmodal;
  FieldInValidNgModal = this.System.FieldInValidNgModal;
  login: any = 0;
  role: any = 1;
  isEditItem: boolean = false;
  isEditBill: boolean = false;
  isview: any = false;
  ArrVendorName: any = [];
  ArrProvince: any = [];
  ArrAmphures: any = [];
  ArrTumbon: any = [];
  ArrProduct: any = [];
  ArrItem: any = [];
  ArrVat: any = [];
  id: any;
  bill_number: any = null;
  Bill_Status: 2;
  CreateByName: any = "";
  CreateByID: any = "";
  Grand = {
    TotalExclude: null,
    Discount: null,
    TotalVat: null,
    TotalInclude: null,
    Totaldiscount: null,
    TotalIncludeVat_no_Discount: null,
  }
  vendor = {
    Name: "",
    Cusid: "",
    Address: "",
    Vattype: "2",
    Province: "",
    ProvinceID: "",
    District: "",
    DistrictID: "",
    Phone: "",
    SubDistrict: "",
    SubDistrictID: "",
    PostCode: "",
    Email: "",
    Vat: 0,
  }
  productItem = {
    ProductName: "",
    ProductId: "",
    Type: "",
    Price: "",
    Volume: 0,
    Brand: "",
    Package: "",
    Description: "",
  }
  validate = {
    Name: false,
    Address: false,
    Province: false,
    District: false,
    SubDistrict: false,
    PostCode: false,
    ProductName: false,
    Volume: false,
  }
  Columns = [
    { ColumnName: "ลำดับ.", SortField: "", Width: "5%" },
    { ColumnName: "ชื่อสินค้า", SortField: "", Width: "30%" },
    { ColumnName: "บรรจุภัณฑ์", SortField: "", Width: "15%" },
    { ColumnName: "ราคา(บาท)", SortField: "", Width: "15%" },
    { ColumnName: "จำนวน", SortField: "", Width: "10%" },
    { ColumnName: "ราคารวม(บาท)", SortField: "", Width: "15%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  arrAddProduct: any = [];
  api = {
    getCustomer: environment.API_URL + "getCustomer",
    getProvinces: environment.API_URL + "getProvinces",
    getAmphures: environment.API_URL + "getAmphures",
    getDistricts: environment.API_URL + "getDistricts",
    getProduct: environment.API_URL + "getBillProduct",
    getVattype: environment.API_URL + "getVattype",
    getProductEdit: environment.API_URL + "getEditBill",
    addBill: environment.API_URL + "ceateBill",
    EditBill: environment.API_URL + "editBill",
    approve: environment.API_URL + "approveBill"
  }
  async ngOnInit() {
    let _this = this;
    this.id = null;
    this.role = localStorage.getItem('role');
    this.System.CheckSession()
    this.Grand = {
      TotalExclude: null,
      Discount: null,
      TotalVat: null,
      TotalInclude: null,
      Totaldiscount: null,
      TotalIncludeVat_no_Discount: null,
    }
    this.vendor = {
      Name: "",
      Cusid: "",
      Address: "",
      Vattype: "2",
      Province: "",
      ProvinceID: "",
      District: "",
      DistrictID: "",
      Phone: "",
      SubDistrict: "",
      SubDistrictID: "",
      PostCode: "",
      Email: "",
      Vat: 0,
    }
    _this.login = localStorage.getItem('id');
    _this.CreateByName = localStorage.getItem('first_name') + " " + localStorage.getItem('last_name')
    console.log(_this.login);
    await this.GetautoComplate();
    await this._ActivatedRoute.queryParams.subscribe(params => {
      //let YearID = (params['str'] + "");
      if (_this._IsNullorUndefined(params["ID"])) {
        let ID = +CryptoJS.AES.decrypt(params["ID"], "id").toString(CryptoJS.enc.Utf8);
        this.EditBill(ID);
      } else {

      }
    })
  }
  async GetautoComplate() {
    let _this = this;
    let lstData: any;
    //Customer 
    await _this.http.get(_this.api.getCustomer, { responseType: 'json' }).toPromise().then(s => { lstData = s });
    if (lstData) {
      _this.ArrVendorName = lstData.data;
    } else {
      _this.ArrVendorName = [];
    }

    //Provine 
    await _this.http.get(_this.api.getProvinces, { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrProvince = lstData.data;
      } else {
        _this.ArrProvince = [];
      }
    });

    //Product 
    await _this.http.get(_this.api.getProduct, { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrProduct = lstData;
      } else {
        _this.ArrProduct = [];
      }
    });

    //Vattype 
    await _this.http.get(_this.api.getVattype, { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrVat = lstData.data;
      } else {
        _this.ArrVat = [];
      }
    });
  }
  async VendorNameChange(item) {
    let _this = this;
    if (item.item != null && item.item != undefined) {
      this.vendor.Address = item.item.Address;
      this.vendor.Cusid = item.item.customer_id
      this.vendor.Address = item.item.Address;
      this.vendor.Phone = item.item.telephone;
      this.vendor.PostCode = item.item.post_code;
      this.vendor.Email = item.item.email;

      if (this._IsNullorUndefined(item.item.province)) {
        await _this.ProvinceChange(_this.formatEvent(item.item.province));
        let provine = _this.ArrProvince.filter(f => f.id == item.item.province)
        _this.vendor.Province = provine[0].name_th;
        _this.vendor.ProvinceID = provine[0].id;
        if (this._IsNullorUndefined(item.item.ampher)) {
          await _this.AmphuresChange(_this.formatEvent(item.item.ampher));
          let Amphures = _this.ArrAmphures.filter(f => f.id == item.item.ampher);
          _this.vendor.District = Amphures[0].name_th;
          _this.vendor.DistrictID = Amphures[0].id;
          if (this._IsNullorUndefined(item.item.tumbon)) {
            let tumbon = _this.ArrTumbon.filter(f => f.id == item.item.tumbon);
            _this.vendor.SubDistrict = tumbon[0].name_th;
            _this.vendor.SubDistrictID = tumbon[0].id;
            _this.vendor.PostCode = tumbon[0].zip_code;
          }
        }
      }
    }
  }

  extract() {
    const config: ModalOptions = { class: 'gray modal-lg' };
   
    this.modalRef = this.modalService.show(ExtractPackageComponent,config);

  }
  async ProvinceChange(item) {
    let _this = this;
    if (item.item != null && item.item != undefined) {
      _this.vendor.Province = item.item.name_th;
      _this.vendor.ProvinceID = item.item.id;
      _this.vendor.District = "";
      _this.vendor.DistrictID = "";
      _this.vendor.SubDistrict = "";
      _this.vendor.SubDistrictID = ""
      _this.vendor.PostCode = "";
      //Provine 
      await _this.http.get(_this.api.getAmphures + "/" + item.item.id, { responseType: 'json' }).toPromise().then((s) => {
        if (s) {
          let lstData: any = s
          _this.ArrAmphures = lstData.data;
        } else {
          _this.ArrAmphures = [];
        }
      });
    }
  }
  async AmphuresChange(item) {
    let _this = this;
    if (item.item != null && item.item != undefined) {
      _this.vendor.District = item.item.name_th;
      _this.vendor.DistrictID = item.item.id;
      _this.vendor.SubDistrict = "";
      _this.vendor.SubDistrictID = ""
      _this.vendor.PostCode = "";
      //Provine 
      await _this.http.get(_this.api.getDistricts + "/" + item.item.id, { responseType: 'json' }).toPromise().then((s) => {
        if (s) {
          let lstData: any = s
          _this.ArrTumbon = lstData.data;
        } else {
          _this.ArrTumbon = [];
        }
      });
    }
  }
  TumbonChange(item) {
    let _this = this;
    if (item.item != null && item.item != undefined) {
      _this.vendor.SubDistrict = item.item.name_th;
      _this.vendor.SubDistrictID = item.item.id
      _this.vendor.PostCode = item.item.zip_code;
    }
  }
  AddItem() {
    let _this = this;
    let pass = true;
    let field = ["ProductName", "Volume"];
    let s = Number(this.productItem["Volume"]);
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.productItem[e], 'string') && Number(this.productItem["Volume"]) > 0) {
        this.validate[e] = false;
      } else {
        this.validate[e] = true;
        pass = false;
      }
    });
    if (pass) {
      let chk = _this.ArrItem.filter(f => f.ProductId == _this.productItem.ProductId && f.Isdel != true);
      if (chk.length == 0) {
        let total = (Number(_this.productItem.Price) * Number(_this.productItem.Volume));
        let lstData = this.ArrItem;
        let _Data = {
          BillNo: "",
          ProductName: _this.productItem.ProductName,
          ProductId: _this.productItem.ProductId,
          Package: _this.productItem.Package,
          Price: _this.productItem.Price,
          Volume: _this.productItem.Volume,
          TotalPrice: total,
          Isdel: false,
        }
        _this.ArrItem.push(_Data);
        console.log(_this.ArrItem);
      } else {
        chk[0].Volume = (Number(chk[0].Volume) + Number(_this.productItem.Volume));
        chk[0].TotalPrice = ((Number(chk[0].Volume) * (Number(chk[0].Price))));
        // _this.SW.SwAlert.Warning(_this.SW.BoxMsg.Title_Warning, _this.SW.BoxMsg.Dec_Data_Dup, undefined);
        // return false;
      }
    } else {
      return false;
    }
    this.CalGrand();
    this.calVat();
    this.clearitem();
  }
  EditItem(id) {
    let _this = this;
    _this.isEditItem = true;

    let lstData = _this.ArrItem.filter(f => f.ProductId == id && f.Isdel == false);
    if (lstData.length > 0) {
      let Date = lstData[0];
      _this.productItem.Volume = Date.Volume;
      _this.productItem.ProductId = Date.ProductId;
      _this.productItem.ProductName = Date.ProductName;
      _this.productItem.Price = Date.price;
      let product = _this.ArrProduct.filter(f => f.id == Date.ProductId);
      if (product.length > 0) {
        _this.productItem.Brand = product[0].brand
        _this.productItem.Package = product[0].packaging_type
        _this.productItem.Description = product[0].description
        _this.productItem.Type = product[0].type;
        _this.productItem.Price = product[0].price;
      }
    }

  }
  SaveEditItem(id) {
    let _this = this;
    let pass = true;
    let field = ["ProductName", "Volume"];
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.productItem[e], 'string') && this.productItem["Volume"] > 0) {
        this.validate[e] = false;
      } else {
        this.validate[e] = true;
        pass = false;
      }
    });
    if (pass) {
      let lstData = _this.ArrItem.filter(f => f.ProductId == id && f.Isdel == false);
      if (lstData.length > 0) {
        let Date = lstData[0];
        Date.Volume = _this.productItem.Volume;
        Date.TotalPrice = ((Number(Date.Volume) * (Number(Date.Price))));
      }
      _this.isEditItem = false;

    }
    _this.CalGrand();
    _this.calVat()
    _this.clearitem();
  }
  DelItem(id) {
    let _this = this;
    let lstData = _this.ArrItem.filter(f => f.ProductId == id && f.Isdel == false);
    if (lstData.length > 0) { }
    lstData[0].Isdel = true;
    _this.CalGrand();
    _this.calVat();
    _this.CalGrand();

  }
  cancelEdit() {
    let _this = this;
    _this.isEditItem = false;
    this.clearitem();
  }
  Approve() {
    let _this = this;
    _this.http.get(_this.api.approve + "/" + _this.bill_number).subscribe(data => {
      if (data) {
        _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {

        })
        _this.router.navigate(['/Bill'])
      }
    }, error => {
      _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { })
    })

  }
  Save(mode, status) {
    let _this = this;
    let pass = true;
    let field = ["Name", "Address", "Province", "District", "SubDistrict", "PostCode", "ProductName", "Volume"];
    if (_this.ArrItem.filter(f => f.Isdel != true).length > 0) {
      field = ["Name", "Address", "Province", "District", "SubDistrict", "PostCode"];
    }
    field.forEach(e => {
      if (!this.FieldInValidNgModal(this.productItem[e], 'string')) {

        this.validate[e] = false;

      } else {

        if (!this.FieldInValidNgModal(this.vendor[e], 'string')) {
          this.validate[e] = false;
        } else {
          this.validate[e] = true;
          pass = false;
        }

      }
    });
    if (pass) {
      let save = async function () {
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        let DataVendor = {
          bill_status: status + "",
          Login: _this.login,
          Name: _this.vendor.Name,
          Cusid: _this.vendor.Cusid,
          Address: _this.vendor.Address,
          ProvinceID: _this.vendor.ProvinceID,
          DistrictID: _this.vendor.DistrictID,
          Phone: _this.vendor.Phone,
          SubDistrictID: _this.vendor.SubDistrictID,
          PostCode: _this.vendor.PostCode,
          Email: _this.vendor.Email,
          VatType: _this.vendor.Vat
        }
        let Grand = {
          TotalExclude: + _this.Grand.TotalExclude,
          Discount: + _this.Grand.Discount,
          TotalVat: + _this.Grand.TotalVat,
          TotalInclude: + _this.Grand.TotalInclude,
          Totaldiscount: + _this.Grand.Totaldiscount,
          Vat_id: + _this.vendor.Vat,
          Vattype: + _this.vendor.Vattype,
          TotalIncludeVat_no_Discount: + _this.Grand.TotalIncludeVat_no_Discount,
          id: _this.id,
        }

        let Data = {
          vendor: DataVendor,
          item: _this.ArrItem.map(m => ({ BillNo: _this.bill_number, ProductId: m.ProductId, Volume: m.Volume + "", Price: m.Price, TotalPrice: m.TotalPrice, Isdel: m.Isdel })),
          detai: Grand,
        }
        let ITEM = JSON.stringify(Data);
        console.log("Data", Data)

        if (mode == "save") {
          _this.http.post(_this.api.addBill, ITEM, headers).subscribe(data => {
            if (data) {
              _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {

              })
              _this.router.navigate(['/Bill'])
            }
          }, error => {
            _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { })
          })
        }
        if (mode == "edit") {
          await _this.http.post(_this.api.EditBill, ITEM, headers).toPromise().then(data => {
            if (data) {
              _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {

              })
              _this.router.navigate(['/Bill'])
            }
          }, error => {
            _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { })
          })

        }
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    }
  }
  async EditBill(id) {
    let _this = this;
    let lstData: any
    await _this.http.get(_this.api.getProductEdit + "/" + id, { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        lstData = s;

      } else {
        lstData = [];
      }
    });
    this.isEditBill = true;
    if (_this._IsNullorUndefined(lstData)) {
      if (lstData.costomer != null && lstData.costomer != undefined) {
        this.vendor.Name = lstData.costomer.company_name;
        this.vendor.Address = lstData.costomer.Address;
        this.vendor.Cusid = lstData.costomer.customer_id;
        this.vendor.Phone = lstData.costomer.telephone;
        this.vendor.PostCode = lstData.costomer.post_code;

        if (_this._IsNullorUndefined(lstData.costomer.province)) {
          await _this.ProvinceChange(_this.formatEvent(lstData.costomer.province));
          let provine = _this.ArrProvince.filter(f => f.id == lstData.costomer.province)
          _this.vendor.Province = provine[0].name_th;
          _this.vendor.ProvinceID = provine[0].id;
          if (_this._IsNullorUndefined(lstData.costomer.ampher)) {
            await _this.AmphuresChange(_this.formatEvent(lstData.costomer.ampher));
            let Amphures = _this.ArrAmphures.filter(f => f.id == lstData.costomer.ampher);
            _this.vendor.District = Amphures[0].name_th;
            _this.vendor.DistrictID = Amphures[0].id;
            if (_this._IsNullorUndefined(lstData.costomer.tumbon)) {
              let tumbon = _this.ArrTumbon.filter(f => f.id == lstData.costomer.tumbon);
              _this.vendor.SubDistrict = tumbon[0].name_th;
              _this.vendor.SubDistrictID = tumbon[0].id;
              _this.vendor.PostCode = tumbon[0].zip_code;
            }
          }
        }
      }
      _this.Grand.TotalExclude = +lstData.bile_detail.vat_exclud;
      _this.Grand.TotalVat = +lstData.bile_detail.only_vat;
      _this.Grand.Discount = +lstData.bile_detail.discount;
      _this.Grand.TotalInclude = +lstData.bile_detail.net_paid;
      // _this.Grand.TotalIncludeVat_no_Discount;
      _this.vendor.Vattype = lstData.bile_detail.vat_type
      _this.vendor.Vat = lstData.bile_detail.vat_id;
      _this.vendor.Email = lstData.costomer.email;
      _this.id = lstData.bile_detail.id;
      _this.bill_number = lstData.bile_detail.bill_number;
      _this.isview = lstData.bile_detail.bill_status == "1" ? true : false;
      _this.CreateByName = lstData.bile_detail.sale_name;
      _this.ArrItem = lstData.bile_item.map(m => ({ BillNo: m.bill_number, ProductName: _this.ArrProduct.filter(f => f.id == m.product_id)[0].name, Package: _this.ArrProduct.filter(f => f.id == m.product_id)[0].packaging_type, ProductId: m.product_id, Price: m.product_price, TotalPrice: m.total_price, Volume: m.Volumes, Isdel: m.isDelete == 1 ? true : false }));
    }
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
    document.getElementById("sVolume").focus();
  }
  CalGrand() {
    let _this = this;
    let arrGtotalExcluded = _this.ArrItem.filter(f => f.Isdel == false).map(m => m.TotalPrice);
    let GtotalAmountExcluded = arrGtotalExcluded.reduce((acc, cur) => acc + Number(cur), 0).toFixed(2)
    _this.Grand.TotalExclude = Number(GtotalAmountExcluded);
    this.Grand.TotalIncludeVat_no_Discount = Number(GtotalAmountExcluded) + Number(this.Grand.TotalVat);
    this.Grand.Totaldiscount = (Number(GtotalAmountExcluded) - Number(_this.Grand.Discount));
    _this.Grand.TotalInclude = Number(GtotalAmountExcluded) + Number(this.Grand.TotalVat) - Number(_this.Grand.Discount);
    // let totaldiscount = (GtotalAmountExcluded - _this.Grand.Discount);
    // this.Grand.Totaldiscount = totaldiscount;
    // this.Grand.TotalInclude = Number(Gtotalinclude) - Number(totaldiscount);
    // this.Grand.TotalIncludeVat_no_Discount = Number(GtotalAmountExcluded) + totalvat;
    // this.Grand.TotalVat = totalvat;

  }
  PDF(id) {
    const link = document.createElement('a');
    link.target = '_blank'
    // link.href = this.System.SiteName + "api/ExportPDF/export/" + this.sReqID + "/" + this.paytovendorForm.get("nContactID").value;
    link.href = environment.API_URL + "report/?bill_number=" + id;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }
  onVolumeBlur() {
    if (this.productItem.Volume != null && this.productItem.Volume != undefined) {
      let readd = this.productItem.Volume.toString().split("");
      if (readd[0] == "0") {
        this.productItem.Volume = null;
      }
    }
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
        }
      }
    }
  }
  calVat() {
    if (this.vendor.Vattype == "1") {
      let totalvat = (Number(this.Grand.TotalExclude) * Number(this.vendor.Vat));
      this.Grand.TotalVat = Number(totalvat);
    } else {
      this.vendor.Vat = 0;
      this.Grand.TotalVat = 0;
    }
    this.CalGrand();
  }
  ModelChange(item) {
    this.Grand.Discount = Number(item.target.value);
    this.CalGrand()
  }
  clearitem() {
    this.validate = {
      Name: false,
      Address: false,
      Province: false,
      District: false,
      SubDistrict: false,
      PostCode: false,
      ProductName: false,
      Volume: false,
    }
    this.productItem = {
      ProductName: "",
      ProductId: "",
      Type: "",
      Price: "",
      Volume: null,
      Brand: "",
      Package: "",
      Description: "",
    }
  }
  _IsNullorUndefined(item) {
    let isnull = false;
    if (item != null && item != undefined) {
      if (item != null && item != undefined) {
        isnull = true;
      } else {
        isnull = false;
      }
    } else {
      isnull = false;
    }
    return isnull;
  }
  CheckPattern(event) {
    const charCode = event.key;
    if (charCode != "Backspace" && charCode != ".") {
      var regExp = new RegExp('[0-9]', 'g');
      if (regExp.test(charCode)) {
        return true;
      } else {
        return false;
      }
    }
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
  formatEvent(data) {
    let obj = {
      id: data,
    }
    let item = {
      item: obj,
    }
    return item;
  }
}
