import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Dataset } from "../../shared/models/dataset.model";
import { environment } from "../../../environments/environment";
import {StorageUtil} from "./storageUtil.service";

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
     * Retrieves all datasets by studyId
     * @param studyId Id of the study
     * @return {Observable<Dataset[]>}
     */
    getAllDatasetsByStudyId(studyId: number): Observable<Dataset[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
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
     * @param studyId
     * @return {Observable<Dataset>}
     */
    getDatasetById(id: number, studyId: number): Observable<Dataset> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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
     * @param studyId
     * @return {Observable<Dataset>}
     */
    createDataset(dataset: Dataset, studyId: number): Observable<Dataset> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        dataset.createdBy = StorageUtil.retrieveUserId();
        dataset.lastUpdatedBy = StorageUtil.retrieveUserId();
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
     * @param studyId
     * @return {Observable<Dataset>}
     */
    updateDataset(dataset: Dataset, studyId: number): Observable<Dataset> {
        const url = `${this.endpoint}/${dataset.datasetId}?studyId=${studyId}`;
        dataset.lastUpdatedBy = StorageUtil.retrieveUserId();
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
     * @param studyId
     * @return {Observable<any>}
     */
    deleteDataset(id: number, studyId: number): Observable<any> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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
