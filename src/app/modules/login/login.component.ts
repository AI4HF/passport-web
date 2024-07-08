import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from "../../shared/models/credentials.model";
import {takeUntil} from "rxjs/operators";

/**
 * Login component which handles the main authorization prospects of the system.
 */
@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor which sets up the parent component injections and the login form.
     * @param injector Element injector from Base Component.
     */
    constructor(
        protected injector: Injector
    ) {
        super(injector);
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            rememberMe: new FormControl(false)
        });
    }

    /**
     * Initial check to skip the login process if the user is already logged in.
     */
    ngOnInit() {
        this.checkRememberedUser();
    }

    /**
     * Color scheme adapter.
     */
    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    /**
     * Remembered user check to skip the login process if necessary.
     */
    checkRememberedUser() {
        const token = this.storageUtil.retrieveToken();
        if (token) {
            this.router.navigate(['/study-management']);
        }
    }

    /**
     * Login logic which calls the Authorization Service to handle the credential checks and token storage.
     */
    login() {
        const { username, password, rememberMe } = this.loginForm.value;
        this.authorizationService.login(new Credentials({ username, password })).pipe(takeUntil(this.destroy$)).subscribe(
            response => {
                this.storageUtil.storeToken(response.access_token, rememberMe);
                this.router.navigate(['/study-management']);
            },
            error => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        );
    }
}

