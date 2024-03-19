import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './../../service/api.service';
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';
/**
 * Login component script which works along with the API Service and the Router identified above
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Login form declaration
   */
  loginForm: FormGroup;
  /**
   * Login message declaration
   */
  loginMessage: string | null = null;
  /**
   * Login success flag to set the styles of the login message based on it
   */
  isLoginSuccess: boolean = false;
  /**
   * Access Token declaration
   */
  token: string;
  /**
   * Used components and modules' initialization
   * @param formBuilder
   * @param apiService
   * @param router
   */
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Form building process based on the html entries.
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Login form controls declaration to make login form elements' access available.
   */
  get formControls() {
    return this.loginForm.controls;
  }
  /**
   * Login method based on the Api Service's Login Request
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.apiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (response: { accessToken: string }) => {
        this.loginMessage = 'Login successful!';
        this.isLoginSuccess = true;
        this.token = response.accessToken;

        const decodedToken = jwt_decode(this.token) as { resources: string[] };
        const resources: string[] = decodedToken.resources;

        sessionStorage.setItem('token', this.token);
        sessionStorage.setItem('roles', JSON.stringify(resources));

        this.router.navigate(['/study_page'], { state: { roles: resources } });
      },
      (error) => {
        this.loginMessage = 'Login failed. Please check your credentials.';
        this.isLoginSuccess = false;
        console.error('Login failed:', error);
      }
    );
  }

}


