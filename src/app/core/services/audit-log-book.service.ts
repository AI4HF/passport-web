import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AuditLogBook } from '../../shared/models/auditLogBook.model';
import { environment } from '../../../environments/environment';
import {AuditLog} from "../../shared/models/auditLog.model";

/**
 * Service to manage AuditLogBook entries.
 */
@Injectable({
    providedIn: 'root',
})
export class AuditLogBookService {
    readonly endpoint = environment.PASSPORT_API_URL + '/audit-log-book';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all AuditLogBook entries for a given Passport ID
     * @param passportId The ID of the Passport
     * @return {Observable<AuditLogBook[]>}
     */
    getAllByPassportId(passportId: string, studyId: String): Observable<AuditLogBook[]> {
        const url = `${this.endpoint}/${passportId}?studyId=${+studyId}`;
        return this.httpClient.get<AuditLogBook[]>(url).pipe(
            map((response: any) => {
                return response.map((item: any) => new AuditLogBook(item));
            }),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates AuditLogBook entries for a given Passport based on its Study ID and Deployment ID
     * @param passportId The ID of the Passport
     * @param studyId The ID of the Study
     * @return {Observable<void>}
     */
    createAuditLogBookEntries(
        passportId: string,
        studyId: number
    ): Observable<void> {
        const url = `${this.endpoint}`;
        return this.httpClient
            .post<void>(url, null, {
                params: {
                    passportId,
                    studyId: studyId.toString()
                },
            })
            .pipe(
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves all AuditLog entries for a given list of AuditLog IDs
     * @param auditLogIds List of AuditLog IDs
     * @param studyId
     * @return {Observable<AuditLog[]>}
     */
    getAuditLogsByIds(auditLogIds: string[], studyId: String): Observable<AuditLog[]> {
        const url = `${this.endpoint}/audit-logs?studyId=${+studyId}`;
        return this.httpClient.post<AuditLog[]>(url, auditLogIds).pipe(
            map((response: any) => {
                return response.map((item: any) => new AuditLog(item));
            }),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
