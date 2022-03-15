import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RouterModule } from '@angular/router';
import { MtFrontComponent } from './component/mt-front/mt-front.component';
import { SidebarModule } from 'ng-sidebar';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AddproductComponent } from './component/addproduct/addproduct.component';
import { AdminComponent } from './component/admin/admin.component';
import { AddBrandComponent } from './component/add-brand/add-brand.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddPakageComponent } from './component/add-pakage/add-pakage.component';
import { AddTypeComponent } from './component/add-type/add-type.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { AddUnitComponent } from './component/add-unit/add-unit.component';
import { BillComponent } from './component/bill/bill.component';
import { IsDelPipe } from './service/is-del.pipe';
import { CreateBillComponent } from './component/create-bill/create-bill.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { StockComponent } from './component/stock/stock.component';
import { ChartOptionComponent } from './component/dashboard/chart-option/chart-option.component';
import { SummaryCardComponent } from './component/dashboard/summary-card/summary-card.component';
import { SummaryChartComponent } from './component/dashboard/summary-chart/summary-chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NotifyComponent } from './notify/notify.component';
import { ExtractPackageComponent } from './component/extract-package/extract-package.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MtFrontComponent,
    DashboardComponent,
    AddproductComponent,
    AdminComponent,
    AddBrandComponent,
    AddPakageComponent,
    AddTypeComponent,
    AddUserComponent,
    AddUnitComponent,
    BillComponent,
    CreateBillComponent,
    IsDelPipe,
    StockComponent,
    ChartOptionComponent,
    SummaryCardComponent,
    SummaryChartComponent,
    NotifyComponent,
    ExtractPackageComponent,
  ],
  imports: [
    FormsModule,
    SidebarModule,
    BrowserModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AppRoutingModule,
    NgbModule,
    TypeaheadModule,
    BrowserAnimationsModule,
    //DatePicker
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatCardModule,
    MatTabsModule
  ],

  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
