import {Component} from '@angular/core';
import {ApiService} from './../../service/api.service';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

/**
 * Login component script which works along with the API Service and the Router identified above
 */
export class LoginComponent {
  /**
   * Login form which gets its elements from the variables in the html and passes them to the login method
   */
  loginForm: FormGroup;

  /**
   * Login message that is set based on the login request result
   */
  loginMessage: string | null = null;

  /**
   * Login success flags which are used as the stylistic conditions of the login message
   */
  isLoginSuccess: boolean = false;
  isLoginError: boolean = false;

  /**
   * @param apiService Service which provides the methods used in this script
   * @param router Router which will handle the routes that will be taken from this page
   * @param formBuilder Utility which builds the login form from the data from the html variables
   */
  constructor(
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Login form calling the login method from the API service with the information provided in the form.
   * Redirections will be available after the implementation of the main page
   */
  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apiService.login(username, password).subscribe(
        (response) => {
          this.loginMessage = 'Login successful!';
          this.isLoginSuccess = true;
          this.isLoginError = false;
        },
        (error) => {
          this.loginMessage = 'Login failed. Please check your credentials.';
          this.isLoginSuccess = false;
          this.isLoginError = true;
          console.error('Login failed:', error);
        }
      );
    }
  }
}
