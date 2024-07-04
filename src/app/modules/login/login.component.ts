import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
    loginForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            rememberMe: new FormControl(false)
        });
    }

    ngOnInit() {
        this.checkRememberedUser();
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    checkRememberedUser() {
        const token = localStorage.getItem('token')||sessionStorage.getItem('token');
        if (token) {
            this.router.navigate(['/study-management']);
        }
    }

    login() {
        const {username, password, rememberMe} = this.loginForm.value;
        // TODO: Implement actual authentication logic here
        const token = 'mock';

        if (rememberMe) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
        this.router.navigate(['/study-management']);
    }
}

