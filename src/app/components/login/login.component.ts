import {Component} from '@angular/core';
import {ApiService} from './../../service/api.service';
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';

/**
 * Login component script which works along with the API Service and the Router identified above
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports:[FormsModule],
})

/**
 * Login message which changes depending on the result of the authentication attempt
 */
export class LoginComponent {
  /**
   * Login form elements that are passed to the login request
   */
  username: string = '';
  password: string = '';

  /**
   * Login message that is set based on the login request result
   */
  loginMessage: string | null = null;

  /**
   * Login success flags which are used as the stylistic conditions of the login message
   */
  isLoginSuccess: boolean = false;
  isLoginError: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
  }

  /**
   * Login form calling the login method from the API service with the information provided in the form.
   * Redirections will be available after the implementation of the main page
   */
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
        console.error('Login failed:');
      }
    );
  }
}
