import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatasetDistribution } from "../../shared/models/datasetDistribution.model";

/**
 * Service to manage the distributions of a published dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetDistributionService {
    readonly endpoint = environment.PASSPORT_API_URL + '/dataset-distribution';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the distributions of a publication record
     * @param catalogueDatasetId Id of the parent record
     * @param studyId Id of the study
     */
    getDatasetDistributionList(catalogueDatasetId: String, studyId: String): Observable<DatasetDistribution[]> {
        const url = `${this.endpoint}?catalogueDatasetId=${catalogueDatasetId}&studyId=${studyId}`;
        return this.httpClient.get<DatasetDistribution[]>(url).pipe(
            map((response: any) => response.map((item: any) => new DatasetDistribution(item))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates a DatasetDistribution
     * @param item The record to create
     * @param studyId Id of the study
     */
    createDatasetDistribution(item: DatasetDistribution, studyId: String): Observable<DatasetDistribution> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<DatasetDistribution>(url, item).pipe(
            map((response: any) => new DatasetDistribution(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Updates a DatasetDistribution
     * @param item The record to update
     * @param studyId Id of the study
     */
    updateDatasetDistribution(item: DatasetDistribution, studyId: String): Observable<DatasetDistribution> {
        const url = `${this.endpoint}/${item.distributionId}?studyId=${studyId}`;
        return this.httpClient.put<DatasetDistribution>(url, item).pipe(
            map((response: any) => new DatasetDistribution(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Deletes a DatasetDistribution
     * @param distributionId Id of the record
     * @param studyId Id of the study
     */
    deleteDatasetDistribution(distributionId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${distributionId}?studyId=${studyId}`;
        return this.httpClient.delete<any>(url).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
