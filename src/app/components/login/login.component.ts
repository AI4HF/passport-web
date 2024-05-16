import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

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
   * Login fail flag to set the styles of the login message based on it
   */
  isLoginFailed: boolean = false;

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
    private translateService: TranslateService
  ) {}

  /**
   * Form building process based on the html entries.
   */
  ngOnInit() {
    if (localStorage.getItem('token') !== null) this.router.navigate(['/study_page']);
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
   * TokenUtil class is also used to extract the resources(roles) out of the token.
   * In the end, token is stored in the localStorage and the roles are written to the userService.
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.apiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (response) => {
        localStorage.setItem('token', response);
        this.router.navigate(['/study_page']);
      },
      (error) => {
        this.isLoginFailed = true;
      }
    );
  }
}
