import {Component, Injector} from '@angular/core';
import {BaseComponent} from "../../shared/components/base.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../core/services/auth-management.service";

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent{
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

    rememberMe: boolean = false;



    /**
     * Used components and modules' initialization
     * @param formBuilder
     * @param apiService
     * @param injector
     */
    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private injector: Injector
    ) {super(injector)}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

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
     */
    login() {
        if (this.loginForm.invalid) {
            return;
        }
        this.apiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
            (response) => {
                this.loginMessage = this.translateService.instant('SUCCESSMSG'); // Translate success message
                this.isLoginSuccess = true;

                localStorage.setItem('token', response);
                this.router.navigateByUrl('/study-management');
            },
            (error) => {
                this.loginMessage = this.translateService.instant('FAILMSG'); // Translate fail message
                this.isLoginSuccess = false;
                console.error('Login failed:', error);
            }
        );
    }
}
