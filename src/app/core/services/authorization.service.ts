import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Credentials} from "../../shared/models/credentials.model";
import {AuthResponse} from "../../shared/models/authResponse.model";

/**
 * Service to manage the Authorization Request
 */
@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    readonly endpoint = environment.PASSPORT_API_URL;
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Login request service implementation
     * @param creds Credential pair of the user
     */
    login(creds:Credentials): Observable<AuthResponse> {
        const url = `${this.endpoint}/user/login`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post<any>(url, creds, { headers })
            .pipe(
                map((response: AuthResponse) => {
                    return response;
                }),
                catchError((error) => {
                    console.error(error);
                    return throwError(error);
                })
            );
    }
}
