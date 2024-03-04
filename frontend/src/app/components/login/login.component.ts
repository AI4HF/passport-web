import { Component } from '@angular/core';
import { ApiService } from './../../service/api.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  //Login message which changes depending on the result of the authentication attempt
  loginMessage: string | null = null;
  isLoginSuccess: boolean = false;
  isLoginError: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  //Login form calling the login method from the API service with the information provided in the form.
  //Redirections will be available after the implementation of the main page
  login() {
    this.apiService.login(this.username, this.password).subscribe(
      (response) => {
        this.loginMessage = 'Login successful!';
        this.isLoginSuccess = true;
        this.isLoginError = false;
      },
      (error) => {

        this.loginMessage = 'Login failed. Please check your credentials.';
        this.isLoginSuccess = false;
        this.isLoginError = true;
        console.log('Login failed:', error);
      }
    );
  }
}
