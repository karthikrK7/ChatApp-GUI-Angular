import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { appConfig } from '../utils/app-config';

//@Injectable()
export class MyInterceptor implements HttpInterceptor {
    error: any;
    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        //if(req.url == "http://localhost:8080/oauth/token"){
           // const headers = new Headers({ Authorization : 'Basic ' + btoa(req.body.model.username + ':' + req.body.model.password) })
           // const request = req.clone({url: appConfig.apiUrl + 'oauth/token',body : req.body.model } )
            return next.handle(req);
       // }
       

    }
}
