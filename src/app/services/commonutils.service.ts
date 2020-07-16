import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonutilsService {
  private access_token: any;
  private user_id: string;
  private user_name: string;
  constructor() { }

  getaccess_token(): any {
    return this.access_token;
  }
  setaccess_token(value: any) {
    this.access_token = value;
  }

  setUser_id(value: string) {
    this.user_id = value;
  }

  getUser_Name(): string {
    return this.user_id;
  }

  setUser_Name(value: string) {
    this.user_name = value;
  }

  getUser_id(): string {
    return this.user_name;
  }
}
