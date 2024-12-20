import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from "../../shared/models/credentials.model";
import {takeUntil} from "rxjs/operators";
import {StorageUtil} from "../../core/services/storageUtil.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import {Role} from "../../shared/models/role.enum";

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
            this.navigateAccordingToRole();
        }else{
            this.roleService.clearRoles();
            this.activeStudyService.clearActiveStudy();
            this.activeStudyService.clearStudies();
        }
    }

    /**
     * Login logic which calls the Authorization Service to handle the credential checks and token storage.
     */
    login() {
        const { username, password, rememberMe } = this.loginForm.value;
        this.authorizationService.login(new Credentials({ username, password })).pipe(takeUntil(this.destroy$)).subscribe(
            response => {
                StorageUtil.storeToken(response.access_token, rememberMe);
                const helper = new JwtHelperService();
                const decodedToken = helper.decodeToken(response.access_token);
                StorageUtil.storeUserId(decodedToken.user_id, rememberMe);
                StorageUtil.storePersonnelName(decodedToken.preferred_username, rememberMe)
                const roles: Role[] = decodedToken.realm_access?.roles?.find((role: string) => (Role[role as keyof typeof Role] !== undefined) && (role == "STUDY_OWNER" || role == "ORGANIZATION_ADMIN"));
                if(roles != null)
                {
                    this.roleService.setRoles(roles);
                }
                this.fetchLoggedPersonnel(rememberMe);
                this.navigateAccordingToRole();
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
                    StorageUtil.storePersonnelSurname(personnel.lastName, rememberMe);
                    StorageUtil.storeOrganizationId(personnel.organizationId, rememberMe);
                },
                error: (error: any) => {
                    if(error.status === 404) {
                        this.router.navigate(['/organization-management/organization']);
                    }else{
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }

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
                StorageUtil.storeOrganizationId(organization.organizationId, rememberMe);
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

    /**
     * Navigate the user according to the roles list
     */
    navigateAccordingToRole() {
        this.roleService.getRolesAsObservable().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: roles => {
                    if (roles.includes(Role.ORGANIZATION_ADMIN)) {
                        this.router.navigate(['/organization-management/organization']);
                    } else {
                        this.router.navigate(['/study-management']);
                    }
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

