import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  productList: any = [];
  groupOfProductList: any = [];
  productSelect;
  productPackage = '';
  product_name_id: any;
  groupSelect = 0;
  resultProduct = 0;
  numberOfExtract = 0;
  maxNumber = 0;
  multiple = 0;
  instockAfterExtract: any;
  bottleInstock: any;
  resultProductBefore: any;
  packageType: any = '';
  constructor(private http: HttpClient) { }

  getProductDetail(){
    this.productList = [];
    this.productSelect = 0;
    this.productPackage = '';
    this.product_name_id = '';
    this.resultProduct = 0;
    this.numberOfExtract = 0;
    this.maxNumber = 0;
    this.multiple = 0;
    this.instockAfterExtract=0;

    this.callProductDetail().subscribe((data: any) => {
      this.productList = data;
      this.product_name_id = this.productList[0].id;
      this.productPackage = this.productList[0].package;
      this.maxNumber = this.productList[0].instock_now;
      this.multiple = this.productList[0].multiple;
      this.instockAfterExtract = this.productList[0].instock_now;
      this.packageType = this.productList[0].title
      if(this.numberOfExtract > this.maxNumber){
        this.numberOfExtract = 0;
      }
      this.getBottleNumber();
    })
  }

  getBottleNumber(){
    this.callNumberOfBottle().subscribe((data: any) => {
      this.bottleInstock = data;
      this.resultProductBefore = this.bottleInstock+this.resultProduct;
    })
  }

  calculate(){
    this.product_name_id = this.productList[this.productSelect].id;
    this.maxNumber = this.productList[this.productSelect].instock_now;
    this.multiple = this.productList[this.productSelect].multiple;
    this.instockAfterExtract = this.productList[this.productSelect].instock_now;
    if(this.numberOfExtract > this.maxNumber){
      this.numberOfExtract = 0;
    }
  }

  getResult(){
    this.resultProduct = this.numberOfExtract*this.multiple;
    this.instockAfterExtract = this.maxNumber - this.numberOfExtract;
    this.resultProductBefore = this.bottleInstock+this.resultProduct;
  }

  extractConfirm(){
    if(this.numberOfExtract > this.maxNumber){
      alert('จำนวนคงเหลือในคลังไม่เพียงพอ!!');
    }
    else if (this.numberOfExtract == 0){
      alert('คุณยังไม่ได้ระบุจำนวนที่ต้องการแยก!!');
    }else{
      // console.log('ok');
      var data = {
        delete_target_id: this.productList[this.productSelect].product_id,
        delete_number: this.numberOfExtract,
        add_to_name_id: this.product_name_id,
        add_number: this.resultProduct
      }
      // console.log(data);
      
      this.callExtractConfirm(data).subscribe((data: any) => {
        alert('สำเร็จ');        
      })
    }
  }

  callProductDetail(): Observable<any>{
    return this.http.get(environment.API_URL + "product/group/extract/all", environment.httpOptions).pipe(
           map((data: any) => {
              //  console.log(data);
             return data;
           }), catchError( error => {
             return throwError( error );
           })
        )
    }

    callNumberOfBottle(): Observable<any>{
      return this.http.get(environment.API_URL + "product/number/extract/"+this.product_name_id, environment.httpOptions).pipe(
             map((data: any) => {           
                //  console.log(data);
               return data[0].instock_now;
             }), catchError( error => {
               return throwError( error );
             })
          )
      }

    callExtractConfirm(data): Observable<any>{
      return this.http.post(environment.API_URL+"stock/extract",data, environment.httpOptions).pipe(
             map((data: any) => {           
               return data;
             }), catchError( error => {
               return throwError( error );
             })
          )
      }
}
