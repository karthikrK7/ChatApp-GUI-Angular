import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonutilsService } from 'src/app/services/commonutils.service';
import { LoginService } from 'src/app/services/login.service';
import * as $ from "jquery";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  payload: any;
  response: any;
  constructor(private loginService: LoginService, private router: Router, private commonService: CommonutilsService) {
    this.payload = {
      username: '', password: 'password', grant_type: 'password'
    };
  }
  ngOnInit(): void {
    
  }

  login() {
    this.loginService.login(this.payload).subscribe(
      resp => {
        this.response = resp;
        if (this.response != '') {
          this.commonService.setUser_id(this.response.user_id);
          this.commonService.setUser_id(this.response.userName);
          this.commonService.setaccess_token(this.response.access_token)
          sessionStorage.setItem('user_id', this.response.user_id);
          sessionStorage.setItem('user_Name', this.response.userName);
          sessionStorage.setItem('access_token', this.response.access_token);
          sessionStorage.setItem('dp_path', this.response.dp_path);
          this.router.navigate(['/mainContent'], {})
        }
      }, error => {
        console.log(error);
        if (error.status == '0') {
          alert('we\'re are unable to reach backend, please try after sometime');
          return;
        } else if (error.error.error_description == 'Bad credentials') {
          alert('Username or password is incorrect');
        }
      }
    );
  }
}


