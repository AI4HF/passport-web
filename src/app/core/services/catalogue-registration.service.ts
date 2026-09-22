import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { CatalogueRegistration } from "../../shared/models/catalogueRegistration.model";

/**
 * Service to read the catalogue entries written for a published dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class CatalogueRegistrationService {
    readonly endpoint = environment.PASSPORT_API_URL + '/catalogue-registration';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the catalogue entries of a publication record
     * @param catalogueDatasetId Id of the parent record
     * @param studyId Id of the study
     */
    getCatalogueRegistrationList(catalogueDatasetId: String, studyId: String): Observable<CatalogueRegistration[]> {
        const url = `${this.endpoint}?catalogueDatasetId=${catalogueDatasetId}&studyId=${studyId}`;
        return this.httpClient.get<CatalogueRegistration[]>(url).pipe(
            map((response: any) => response.map((item: any) => new CatalogueRegistration(item))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates a CatalogueRegistration
     * @param item The record to create
     * @param studyId Id of the study
     */
    createCatalogueRegistration(item: CatalogueRegistration, studyId: String): Observable<CatalogueRegistration> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<CatalogueRegistration>(url, item).pipe(
            map((response: any) => new CatalogueRegistration(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Updates a CatalogueRegistration
     * @param item The record to update
     * @param studyId Id of the study
     */
    updateCatalogueRegistration(item: CatalogueRegistration, studyId: String): Observable<CatalogueRegistration> {
        const url = `${this.endpoint}/${item.registrationId}?studyId=${studyId}`;
        return this.httpClient.put<CatalogueRegistration>(url, item).pipe(
            map((response: any) => new CatalogueRegistration(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Deletes a CatalogueRegistration
     * @param registrationId Id of the record
     * @param studyId Id of the study
     */
    deleteCatalogueRegistration(registrationId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${registrationId}?studyId=${studyId}`;
        return this.httpClient.delete<any>(url).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
