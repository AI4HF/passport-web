import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {StorageUtil} from "../services/storageUtil.service";

/**
 * An HTTP interceptor which sets up all requests' Authorization headers and logouts if there is an Unauthorized check.
 * Prevents expired token users to access the page structures.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

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
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}
