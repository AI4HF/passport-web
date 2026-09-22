import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { CatalogueDataset } from "../../shared/models/catalogueDataset.model";

/**
 * Service to manage the publication decision recorded for a dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class CatalogueDatasetService {
    readonly endpoint = environment.PASSPORT_API_URL + '/catalogue-dataset';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the publication record of a dataset
     * @param datasetId Id of the parent record
     * @param studyId Id of the study
     */
    getCatalogueDatasetList(datasetId: String, studyId: String): Observable<CatalogueDataset[]> {
        const url = `${this.endpoint}?datasetId=${datasetId}&studyId=${studyId}`;
        return this.httpClient.get<CatalogueDataset[]>(url).pipe(
            map((response: any) => response.map((item: any) => new CatalogueDataset(item))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates a CatalogueDataset
     * @param item The record to create
     * @param studyId Id of the study
     */
    createCatalogueDataset(item: CatalogueDataset, studyId: String): Observable<CatalogueDataset> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<CatalogueDataset>(url, item).pipe(
            map((response: any) => new CatalogueDataset(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Updates a CatalogueDataset
     * @param item The record to update
     * @param studyId Id of the study
     */
    updateCatalogueDataset(item: CatalogueDataset, studyId: String): Observable<CatalogueDataset> {
        const url = `${this.endpoint}/${item.catalogueDatasetId}?studyId=${studyId}`;
        return this.httpClient.put<CatalogueDataset>(url, item).pipe(
            map((response: any) => new CatalogueDataset(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Deletes a CatalogueDataset
     * @param catalogueDatasetId Id of the record
     * @param studyId Id of the study
     */
    deleteCatalogueDataset(catalogueDatasetId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${catalogueDatasetId}?studyId=${studyId}`;
        return this.httpClient.delete<any>(url).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
