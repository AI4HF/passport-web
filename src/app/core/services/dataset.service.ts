import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Dataset } from "../../shared/models/dataset.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage datasets.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetService {

    readonly endpoint = environment.PASSPORT_API_URL + '/dataset';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all datasets
     * @return {Observable<Dataset[]>}
     */
    getAllDatasets(): Observable<Dataset[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Dataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((dataset: any) => new Dataset(dataset));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a dataset by id
     * @param id Id of the dataset
     * @return {Observable<Dataset>}
     */
    getDatasetById(id: number): Observable<Dataset> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Dataset>(url)
            .pipe(
                map((response: any) => {
                    return new Dataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves datasets by feature set id
     * @param featureSetId Id of the feature set
     * @return {Observable<Dataset[]>}
     */
    getDatasetsByFeatureSetId(featureSetId: number): Observable<Dataset[]> {
        const url = `${this.endpoint}/featureset/${featureSetId}`;
        return this.httpClient.get<Dataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((dataset: any) => new Dataset(dataset));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a dataset
     * @param dataset dataset to be created
     * @return {Observable<Dataset>}
     */
    createDataset(dataset: Dataset): Observable<Dataset> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<Dataset>(url, dataset)
            .pipe(
                map((response: any) => {
                    return new Dataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a dataset
     * @param dataset updated version of the dataset
     * @return {Observable<Dataset>}
     */
    updateDataset(dataset: Dataset): Observable<Dataset> {
        const url = `${this.endpoint}/${dataset.datasetId}`;
        return this.httpClient.put<Dataset>(url, dataset)
            .pipe(
                map((response: any) => {
                    return new Dataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a dataset
     * @param id Id of the dataset
     * @return {Observable<any>}
     */
    deleteDataset(id: number): Observable<any> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.delete<any>(url)
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
