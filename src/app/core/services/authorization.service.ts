import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, pipe, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Credentials} from "../../shared/models/credentials.model";

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


    login(creds:Credentials): Observable<any> {
        const url = `${this.endpoint}/user/login`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post<any>(url, creds, { headers })
            .pipe(
                map((response: any) => {
                    return response.access_token;
                }),
                catchError((error) => {
                    console.log(error);
                    return throwError(error);
                })
            );
    }
}
