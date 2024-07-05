import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../core/services/authorization.service';
import { Credentials } from "../../shared/models/credentials.model";
import { StorageUtil } from '../../core/services/storageUtil.service';

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
     * @param authorizationService Authorization HTTP requests.
     * @param storageUtilService Utility service for handling token storage.
     */
    constructor(
        protected injector: Injector,
        private authorizationService: AuthorizationService,
        private storageUtilService: StorageUtil
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
        const token = this.storageUtilService.retrieveToken();
        if (token) {
            this.router.navigate(['/study-management']);
        }
    }

    /**
     * Login logic which calls the Authorization Service to handle the credential checks and token storage.
     */
    login() {
        const { username, password, rememberMe } = this.loginForm.value;
        this.authorizationService.login(new Credentials({ username, password })).subscribe(
            token => {
                this.storageUtilService.storeToken(token, rememberMe);
                this.router.navigate(['/study-management']);
            }
        );
    }
}

