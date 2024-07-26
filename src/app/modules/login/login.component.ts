import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from "../../shared/models/credentials.model";
import {takeUntil} from "rxjs/operators";
import {StorageUtil} from "../../core/services/storageUtil.service";

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
        const token = StorageUtil.retrieveToken();
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
                StorageUtil.storeToken(response.authResponse.access_token, rememberMe);
                StorageUtil.storeUserId(response.userId, rememberMe);
                this.fetchLoggedPersonnel(rememberMe);
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

    /**
     * Fetch logged personnel information
     * @param rememberMe boolean for remember feature
     */
    fetchLoggedPersonnel(rememberMe: boolean): void {
        if(StorageUtil.retrieveUserId()){
            this.personnelService.getPersonnelByPersonId(StorageUtil.retrieveUserId())
                .pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    StorageUtil.storePersonnelName(personnel.firstName, rememberMe);
                    StorageUtil.storePersonnelSurname(personnel.lastName, rememberMe);
                    this.fetchLoggedOrganization(personnel.organizationId, rememberMe);
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        }
    }

    /**
     * Fetch logged organization information
     * @param orgId The ID of organization
     * @param rememberMe boolean for remember feature
     */
    fetchLoggedOrganization(orgId: number, rememberMe: boolean): void {
        this.organizationService.getOrganizationById(orgId)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: organization => {
                StorageUtil.storeOrganizationName(organization.name, rememberMe);
                this.router.navigate(['/study-management']);
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }
}

