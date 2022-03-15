import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { ProductDetailService } from 'src/app/service/product-detail.service';
@Component({
  selector: 'app-extract-package',
  templateUrl: './extract-package.component.html',
  styleUrls: ['./extract-package.component.css']
})
export class ExtractPackageComponent implements OnInit {
  productList: any = [];
  constructor( private bsModalRef: BsModalRef,private http: HttpClient, public product: ProductDetailService) { }
  
  ngOnInit(): void {
    this.product.getProductDetail();
  }


close() {
    this.bsModalRef.hide();
}

  
}
