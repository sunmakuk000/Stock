import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AddBrandComponent } from './component/add-brand/add-brand.component';
import { AddPakageComponent } from './component/add-pakage/add-pakage.component';
import { AddTypeComponent } from './component/add-type/add-type.component';
import { AddUnitComponent } from './component/add-unit/add-unit.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { AddproductComponent } from './component/addproduct/addproduct.component';
import { AdminComponent } from './component/admin/admin.component';
import { BillComponent } from './component/bill/bill.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MtFrontComponent } from './component/mt-front/mt-front.component';
import { CreateBillComponent } from './component/create-bill/create-bill.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { StockComponent } from './component/stock/stock.component';
const routes: Routes = [
 // { path: '', component: MtFrontComponent, pathMatch: 'full', canActivate: [ AuthGuard ] },
  {
    path: '',
    component: MtFrontComponent, canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [ AuthGuard ] },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Admin', component: AdminComponent },
      { path: 'Addproduct', component: AddproductComponent },
      { path: 'Brand', component: AddBrandComponent },
      { path: 'Type', component: AddTypeComponent },
      { path: 'Pakage', component: AddPakageComponent },
      { path: 'UserManage', component: AddUserComponent },
      { path: 'Unit', component: AddUnitComponent },
      { path: 'Bill', component: BillComponent },
      { path: 'Create-Bill', component: CreateBillComponent },
      { path: 'Stock', component: StockComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
];
const config: ExtraOptions = {
  useHash: true,
  onSameUrlNavigation: 'reload',
  enableTracing: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [ AuthGuard ]
})
export class AppRoutingModule { }
