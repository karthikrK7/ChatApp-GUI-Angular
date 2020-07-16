import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../utils/app-config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(model: any) {
    var data = "username="+model.username+"&password="+model.password+"&grant_type=password";
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers = headers.set('Authorization', 'Basic ' + btoa("USER_CLIENT_APP" + ':' + "password"));//btoa(model.username + ':' + model.password)   'VVNFUl9DTElFTlRfQVBQOnBhc3N3b3Jk'
    return this.http.post(appConfig.apiUrl + '/oauth/token', data, { headers: headers })
}
}
