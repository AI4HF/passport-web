import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatasetConcept } from "../../shared/models/datasetConcept.model";

/**
 * Service to manage the controlled-vocabulary values a Data Steward records on a dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetConceptService {
    readonly endpoint = environment.PASSPORT_API_URL + '/dataset-concept';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the controlled-vocabulary values of a dataset
     * @param datasetId Id of the parent record
     * @param studyId Id of the study
     */
    getDatasetConceptList(datasetId: String, studyId: String): Observable<DatasetConcept[]> {
        const url = `${this.endpoint}?datasetId=${datasetId}&studyId=${studyId}`;
        return this.httpClient.get<DatasetConcept[]>(url).pipe(
            map((response: any) => response.map((item: any) => new DatasetConcept(item))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates a DatasetConcept
     * @param item The record to create
     * @param studyId Id of the study
     */
    createDatasetConcept(item: DatasetConcept, studyId: String): Observable<DatasetConcept> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<DatasetConcept>(url, item).pipe(
            map((response: any) => new DatasetConcept(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Updates a DatasetConcept
     * @param item The record to update
     * @param studyId Id of the study
     */
    updateDatasetConcept(item: DatasetConcept, studyId: String): Observable<DatasetConcept> {
        const url = `${this.endpoint}/${item.conceptId}?studyId=${studyId}`;
        return this.httpClient.put<DatasetConcept>(url, item).pipe(
            map((response: any) => new DatasetConcept(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Deletes a DatasetConcept
     * @param conceptId Id of the record
     * @param studyId Id of the study
     */
    deleteDatasetConcept(conceptId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${conceptId}?studyId=${studyId}`;
        return this.httpClient.delete<any>(url).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
