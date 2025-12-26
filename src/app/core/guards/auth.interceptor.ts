import {Injectable, Injector} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';
import {StorageUtil} from "../services/storageUtil.service";
import {ActiveStudyService} from "../services/activeStudy.service";
import {RoleService} from "../services/role.service";
import {Role} from "../../shared/models/role.enum";

/**
 * An HTTP interceptor which sets up all requests' Authorization headers and logouts if there is an Unauthorized check.
 * Prevents expired token users to access the page structures.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private injector: Injector) {}

    /**
     * Interceptor which controls tasks related to token injection and authorization control on inner pages.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = StorageUtil.retrieveToken();
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        /**
         * Second part of the interceptor which checks for the Unauthorized(401) code from requests to:
         * Detect expired tokens and revokes access.
         * Detect cases with direct page access without authorization and revokes access.
         */
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    StorageUtil.removeToken();
                    StorageUtil.removeUserId();
                    StorageUtil.removeOrganizationName();
                    StorageUtil.removeOrganizationId();
                    StorageUtil.removePersonnelName();
                    StorageUtil.removePersonnelSurname();
                    const navigationExtras: NavigationExtras = {
                        state: {
                            message: 'Unauthorized',
                            severity: 'error',
                            detail: error.message
                        }
                    };
                    this.router.navigate(['/login'], navigationExtras);
                }
                else if (error.status === 403) {
                    const navigationExtras: NavigationExtras = {
                        state: {
                            message: 'Forbidden',
                            severity: 'error',
                            detail: 'You do not have access to this resource.'
                        }
                    };
                    this.router.navigate(['/not-found'], navigationExtras);
                }
                else if (error.status === 410) {
                    const navigationExtras: NavigationExtras = {
                        state: {
                            message: 'Study Not Found',
                            severity: 'error',
                            detail: 'Authorized Study does not exist.'
                        }
                    };
                    const activeStudyService = this.injector.get(ActiveStudyService);
                    const roleService = this.injector.get(RoleService)
                    const roles = roleService.getRoles();
                    roleService.clearRoles();
                    if(roles.includes(Role.STUDY_OWNER)) roleService.setRoles([Role.STUDY_OWNER]);
                    activeStudyService.clearActiveStudy();
                    this.router.navigate(['/study-management'], navigationExtras);
                }

                return throwError(error);
            })
        );
    }
}
