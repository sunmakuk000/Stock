import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private user: UserService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      // console.log(response.status)
    if (localStorage.getItem('role')) {
      // this.router.navigate(['Addproduct']);
      return true;
    }
    else{
      this.router.navigate(['login']);
      return false;
    }
  }
}
