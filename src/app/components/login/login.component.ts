import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from "@angular/router";
import { UserService } from '../../service/user.service';
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
   * Used components and modules' initialization
   * @param formBuilder
   * @param apiService
   * @param router
   * @param userService
   */
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
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

        const decodedToken = jwt_decode(response.accessToken) as { resources: string[] };
        const resources: string[] = decodedToken.resources;

        localStorage.setItem('token', response.accessToken);
        this.userService.setRoles(resources);

        this.router.navigate(['/study_page']);
      },
      (error) => {
        this.loginMessage = 'Login failed. Please check your credentials.';
        this.isLoginSuccess = false;
        console.error('Login failed:', error);
      }
    );
  }

  onInputChange() {
    this.loginMessage = null;
  }

}


