import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  user: any = {
    first_name: '',
    last_name: '',
    role: 999,
    permission: ''
  }
}
