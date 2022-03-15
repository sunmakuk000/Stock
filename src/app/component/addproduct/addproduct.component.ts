import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SWAlertService } from 'src/app/service/swalert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { async } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CenterFnService } from 'src/app/service/center-fn.service';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  isAddProduct: any = false;
  modeAdd: any;
  ModeStock: boolean = false;
  arrNameProduct: any = [];
  modalRef: BsModalRef;
  arrOldProduct: any = [];
  login: any = 0;
  onProductNameChange: any = false;
  ArrItem: any = [];
  constructor(private modalService: BsModalService, private http: HttpClient,
    private SW: SWAlertService, private System: CenterFnService) { }
  diaplayCss = this.System.checkByNgmodal;
  FieldInValidNgModal = this.System.FieldInValidNgModal;
  Columns = [
    { ColumnName: "ลำดับ", SortField: "", Width: "3%" },
    { ColumnName: "ชื่อสินค้า", SortField: "", Width: "28%" },
    { ColumnName: "บรรจุภัณฑ์", SortField: "", Width: "12%" },
    { ColumnName: "ราคาทุน(THB)", SortField: "", Width: "14%" },
    { ColumnName: "ราคา(THB)", SortField: "", Width: "12%" },
    { ColumnName: "คงเหลือในคลัง", SortField: "", Width: "10%" },
    { ColumnName: "", SortField: "", Width: "7%" },
    { ColumnName: "", SortField: "", Width: "15%" },
  ]
  Columns2 = [
    { ColumnName: "ปริมาณบรรจุ", SortField: "", Width: "12%" },
    { ColumnName: "ราคาทุน(THB)", SortField: "", Width: "14%" },
    { ColumnName: "ราคา(THB)", SortField: "", Width: "12%" },
    { ColumnName: "ขั้นต่ำ", SortField: "", Width: "7%" },
    { ColumnName: "", SortField: "", Width: "7%" },
  ]
  none: any = false;
  // ALLArray
  validate = {
    ProductName: false,
    Volume: false,
  }
  arrProduct: any = { data: [] };
  arrUnit: any = [];
  arrType: any = [];
  arrBrand: any = [];
  arrGroupPakage: any = [];
  MasterGroup: any = [];
  arrPakage: any = [];
  GroupPackage: any = 1;
  detailforProduct: any = {
    price: 0.0,
    cost: 0,
    package: 0,
    notify: null,
    GroupPackage: 0,
  }
  //-------------------
  addProductNew = {
    id: "",
    name: "",
    brand: 0,
    type: 0,
    size: 0,
    unit: 0,
    package: 0,
    Group: [],
    description: "",
  }
  addProduct = {
    id: "",
    name: "",
    brand: 0,
    price: 0.0,
    package: 0,
    type: 0,
    size: 0,
    unit: 0,
    cost: 0,
    notify: null,
    description: "",
  }
  addStock = {
    name: "",
    id: "",
    total: 0,
    Nowstock: 0,
    New: 0
  }
  search = {
    sBrand: null,
    sType: null,
    sPackage: null,
    sSearch: null,
  }
  page = 1;
  pageSize = 10;
  stockAction: Boolean = true;
  ArrProductSeach: any;
  public settings = {};
  ngOnInit(): void {
    let _this = this;
    _this.login = localStorage.getItem('id');
    this.System.CheckSession();
    this.GetProduct();
    this.GetAllSelect();
    //Product 
    _this.http.get(environment.API_URL + "getProductForSearch", { responseType: 'json' }).toPromise().then(s => {
      if (s) {
        let lstData: any = s
        _this.ArrProductSeach = lstData;
      } else {
        _this.ArrProductSeach = [];
      }
    });
  }
  addModel(Insert: TemplateRef<any>) {  //เปิด PopUp
    this.arrOldProduct = []
    this.GetAllSelect();
    this.onProductNameChange = false;
    let _this = this;
    _this.addProductNew.name = "";
    this.addProductNew = {
      id: "",
      name: "",
      brand: 0,
      type: 0,
      size: 0,
      unit: 0,
      package: 0,
      Group: [],
      description: "",
    }
    var detailforProduct = {
      GroupName: _this.arrGroupPakage[6].title,
      price: 0.0,
      cost: 0,
      notify: null,
      GroupPackage: _this.arrGroupPakage[6].id,
      Isdel: false
    }
    _this.addProductNew.Group.push(detailforProduct)
    _this.MasterGroup = _this.MasterGroup.filter(f => f.id != _this.arrGroupPakage[6].id);
    _this.GroupPackage = _this.MasterGroup[0].id;
    _this.modeAdd = true;
    const config: ModalOptions = { class: 'gray modal-xl' };
    this.modalRef = this.modalService.show(Insert, config);
  }
  addGroup(id) {
    let _this = this;

    let Data = _this.addProductNew.Group.filter(f => f.GroupPackage == id)
    _this.arrOldProduct.push(false)
    if (Data.length > 0) {
      Data[0].Isdel = false;
    } else {
      let group = _this.MasterGroup.filter(f => f.id == id);
      var detailforProduct = {
        GroupName: group[0].title,
        price: 0.0,
        cost: 0,
        notify: null,
        GroupPackage: group[0].id,
        Isdel: false
      }
      _this.addProductNew.Group.push(detailforProduct)
      _this.MasterGroup = _this.MasterGroup.filter(f => f.id != id);
      if (_this.MasterGroup.length == 0) {
        _this.none = true;
      } else {
        _this.GroupPackage = _this.MasterGroup[0].id;
      }
    }
    console.log(_this.addProductNew)
  }
  delGroup(id) {
    let data = this.addProductNew.Group.filter(f => f.GroupPackage == id);
    this.addProductNew.Group.findIndex(f => f.GroupPackage == id);
    if (data.length > 0) {
      data[0].Isdel = true;
      let DataGroup = this.arrGroupPakage.filter(f => f.id == id)[0];
      this.MasterGroup.push(DataGroup);
      if (this.MasterGroup.length > 0) {
        this.none = false;
      }
    }
  }
  async Search() {
    await this.GetProduct();

    if (this.search.sSearch != null && this.search.sSearch != "") {
      var search = new RegExp(this.search.sSearch, 'i'); // prepare a regex object
      this.arrProduct.data = this.arrProduct.data.filter(item => search.test(item.name));
    }
    if (this.search.sType != null && this.search.sType != "null") {
      this.arrProduct.data = this.arrProduct.data.filter(f => f.type == this.search.sType);
    }
    if (this.search.sBrand != null && this.search.sBrand != "null") {
      this.arrProduct.data = this.arrProduct.data.filter(f => f.brand == this.search.sBrand);
    }
    if (this.search.sPackage != null && this.search.sPackage != "null") {
      this.arrProduct.data = this.arrProduct.data.filter(f => f.packaging_type == this.search.sPackage);
    }
  }
  async ClearSearch() {
    await this.GetProduct();
    this.search = {
      sBrand: null,
      sType: null,
      sPackage: null,
      sSearch: null,
    }
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
        name: _this.addProductNew.name,
        brand: +_this.addProductNew.brand,
        //  price: +_this.addProductNew.price,
        package: +_this.addProductNew.package,
        type: +_this.addProductNew.type,
        size: +_this.addProductNew.size,
        // cost: +_this.addProductNew.cost,
        //  stock_notify: _this.addProductNew.notify == null ? null : +_this.addProductNew.notify,
        DataGroup: _this.addProductNew.Group,
        unit: +_this.addProductNew.unit,
        description: _this.addProductNew.description
      }
      console.log(_Data)
      let ITEM = JSON.stringify(_Data);
      await _this.http.post(environment.API_URL + "addProduct", ITEM, headers).toPromise().then(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetProduct();
          })

        }
      }, error => { console.log(error); _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }
  async GetProduct() {
    let _this = this;
    await _this.http.get(environment.API_URL + "getProduct").toPromise().then(data => {
      if (data) {
        let lstData: any;
        _this.arrProduct = data;
        lstData = data;
        lstData.data.forEach(f => {
          let have = _this.arrNameProduct.filter(d => d.product_name_id == f.product_name_id);
          if (have != undefined) {
            if (have.length > 0) {

            } else {
              _this.arrNameProduct.push(f);
            }
          } else {
            _this.arrNameProduct.push(f);
          }
        })

      } else {
        _this.arrProduct = [];
      }
    })
  }
  async GetAllSelect() {
    let _this = this;
    await _this.http.get(environment.API_URL + "getUnitType").toPromise().then(data => {
      if (data) {
        _this.arrUnit = data;
        //  _this.addProduct.unit = data[0].id;
      } else {
        _this.arrUnit = [];
      }
    })
    await _this.http.get(environment.API_URL + "getType").toPromise().then(data => {
      if (data) {
        _this.arrType = data;
        //  _this.addProduct.type = data[0].id;
      } else {
        _this.arrType = [];
      }
    })

    await _this.http.get(environment.API_URL + "getBrand").toPromise().then(data => {
      if (data) {
        _this.arrBrand = data;
        // _this.addProduct.brand = data[0].id;
      } else {
        _this.arrBrand = [];
      }
    })

    await _this.http.get(environment.API_URL + "getPackageGroup").toPromise().then(data => {
      if (data) {
        _this.arrGroupPakage = data;
        _this.MasterGroup = data;
        // _this.addProduct.brand = data[0].id;
      } else {
        _this.arrGroupPakage = [];
        _this.MasterGroup = [];
      }
    })

    await _this.http.get(environment.API_URL + "getPackagingType").toPromise().then(data => {
      if (data) {
        _this.arrPakage = data;
        // _this.addProduct.package = data[0].id
      } else {
        _this.arrPakage = [];
      }
    }
    )
  }
  ProductNameChange(item) {
    let _this = this;
    _this.arrOldProduct = [];
    // _this.GetAllSelect();
    _this.onProductNameChange = true;
    this.addProductNew = {
      id: item.item.id,
      name: item.item.name,
      brand: item.item.brand,
      type: item.item.type,
      size: 0,
      unit: 0,
      package: item.item.package_id,
      Group: [],
      description: "",
    }
    let Data = _this.arrProduct.data.filter(f => f.product_name_id == item.item.product_name_id)
    if (Data.length > 0) {
      Data.forEach(d => {
        _this.arrOldProduct.push(true)
        var detailforProduct = {
          GroupName: d.package_group + "(" + d.multiple + ")",
          price: d.price,
          cost: d.cost,
          notify: d.stock_notify,
          GroupPackage: d.package_group_id,
          Isdel: false
        }
        _this.addProductNew.Group.push(detailforProduct)
      })
      let arrp = [];
      let arr = Data.map(m => m.package_group_id);
      _this.MasterGroup.forEach(f => {
        let s = arr.includes(f.id)
        if (s) {

        } else {
          arrp.push(f);
        }

      })
      _this.MasterGroup = arrp;
      _this.GroupPackage = _this.MasterGroup[0].id;
    }
  }
  onProductBlur(item) {
    let _this = this;
    let have = _this.arrNameProduct.filter(f => f.name == item.value);
    if (!this.isAddProduct && have.length > 0 && _this.addProductNew.name) {
      this.ProductNameChange(item);
      _this.onProductNameChange = !this.isAddProduct;
    } else {
      this.GetAllSelect();
      this.onProductNameChange = false;
      let _this = this;
      _this.arrOldProduct = [];
      this.addProductNew.id = "";
      this.addProductNew.brand = 0;
      this.addProductNew.type = 0;
      this.addProductNew.size = 0;
      this.addProductNew.unit = 0;
      this.addProductNew.package = 0;
      this.addProductNew.Group = [];
      this.addProductNew.description = "";

      var detailforProduct = {
        GroupName: _this.arrGroupPakage[6].title,
        price: 0.0,
        cost: 0,
        notify: null,
        GroupPackage: _this.arrGroupPakage[6].id,
        Isdel: false
      }
      _this.addProductNew.Group.push(detailforProduct)
      _this.MasterGroup = _this.MasterGroup.filter(f => f.id != _this.arrGroupPakage[6].id);
      _this.GroupPackage = _this.MasterGroup[0].id;
    }
  }
  ProductNoResult(item) {
    this.isAddProduct = item;
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
            _this.GetProduct();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_Delete, save, undefined);
  }
  async Edit(Insert: TemplateRef<any>, id) {
    let _this = this;
    _this.modeAdd = false;
    let sdata: any;
    let Data = _this.arrProduct.data.filter(f => f.id == id)
    let item = Data[0];
    this.addProductNew = {
      id: item.id,
      name: item.name,
      brand: item.brand,
      type: item.type,
      size: 0,
      unit: 0,
      package: item.package_id,
      Group: [],
      description: "",
    }
    let Data1 = _this.arrProduct.data.filter(f => f.id == id)
    if (Data1.length > 0) {
      Data1.forEach(d => {
        _this.arrOldProduct.push(true)
        var detailforProduct = {
          GroupName: d.package_group + "(" + d.multiple + ")",
          price: d.price,
          cost: d.cost,
          notify: d.stock_notify,
          GroupPackage: d.package_group_id,
          Isdel: false
        }
        _this.addProductNew.Group.push(detailforProduct)
      })
      const config: ModalOptions = { class: 'gray modal-xl' };
      this.modalRef = this.modalService.show(Insert, config);
    }
  }
  SaveEdit(id) {
    let _this = this;
    let result: any;
    let save = async function () {
      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      let _Data = {
        id: +id,
        name: _this.addProductNew.id,
        brand: +_this.addProductNew.brand,
        price: +_this.addProductNew.Group[0].price,
        package: +_this.addProductNew.package,
        package_group: +_this.addProductNew.Group[0].GroupPackage,
        type: +_this.addProductNew.type,
        size: +_this.addProductNew.size,
        unit: +_this.addProductNew.unit,
        cost: +_this.addProductNew.Group[0].cost,
        stock_notify: _this.addProductNew.Group[0].notify == null ? null : +_this.addProductNew.Group[0].notify,
        description: _this.addProductNew.description
      }
      let ITEM = JSON.stringify(_Data);
      await _this.http.post(environment.API_URL + "editProduct", ITEM, headers).toPromise().then(data => {
        if (data) {
          _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
            _this.modalRef.hide();
            _this.GetProduct();
          })

        }
      }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
    }
    _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
  }

  Stock(id, mode, addStock: TemplateRef<any>) {
    let Data = this.arrProduct.data.filter(f => f.id == id);
    if (Data != null && Data != undefined) {

      this.addStock.New = 0;
      this.addStock.total = +Data[0].stock;
      this.addStock.Nowstock = +Data[0].stock;
      this.addStock.id = Data[0].id;
      this.addStock.name = Data[0].name;
    }
    if (mode == 1) {
      this.ModeStock = true;
    } if (mode == 2) {
      this.ModeStock = false;
    }

    const config: ModalOptions = { class: 'gray modal-md' };
    this.modalRef = this.modalService.show(addStock, config);

  }
  calStock(Mode) { // 1 Add Stock , 2 Delete Stock
    if (Mode == 1) {
      let total = Number(this.addStock.Nowstock) + Number(this.addStock.New);
      if (total < 0) {
        this.SW.SwAlert.Warning(this.SW.BoxMsg.Title_info, "Low Stock", function () { })
        this.addStock.New = 0;
        this.addStock.total = this.addStock.Nowstock;
        return false;
      } else {
        this.addStock.total = total;
      }
    }
    if (Mode == 2) {
      let total = Number(this.addStock.Nowstock) - Number(this.addStock.New);
      if (total < 0) {
        this.SW.SwAlert.Warning(this.SW.BoxMsg.Title_info, "Low Stock", function () { })
        this.addStock.New = 0;
        this.addStock.total = this.addStock.Nowstock;
        return false;
      } else {
        this.addStock.total = total;
      }
    }
  }
  SaveAddStock(mode) {
    let _this = this;
    if (mode == 1) {
      let save = function () {
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        let _Data = {
          stock_result: +_this.addStock.total,
          id: _this.addStock.id,
          stock_num: +_this.addStock.New,
          sale_id: _this.login,

        }
        let ITEM = JSON.stringify(_Data);
        _this.http.post(environment.API_URL + "addStock", ITEM, headers).subscribe(data => {
          if (data) {
            _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_Save_Success, function () {
              _this.modalRef.hide();
              _this.GetProduct();
            })

          }
        }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    } if (mode == 2) {
      let save = function () {
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        let _Data = {
          stock_result: +_this.addStock.total,
          id: _this.addStock.id,
          stock_num: +_this.addStock.New,
          sale_id: _this.login,

        }
        let ITEM = JSON.stringify(_Data);
        _this.http.post(environment.API_URL + "deleteStock", ITEM, headers).subscribe(data => {
          if (data) {
            _this.SW.SwAlert.Success(_this.SW.BoxMsg.Title_Success, _this.SW.BoxMsg.Dec_want_Delete, function () {
              _this.modalRef.hide();
              _this.GetProduct();
            })

          }
        }, error => { _this.SW.SwAlert.Error(_this.SW.BoxMsg.Title_info, error.error.message, function () { }) })
      }
      _this.SW.SwAlert.Confirm(_this.SW.BoxMsg.Title_Confirm, _this.SW.BoxMsg.Dec_want_save, save, undefined);
    }
  }
  CheckPattern(event) {
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
