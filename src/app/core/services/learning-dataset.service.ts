import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningDataset } from "../../shared/models/learningDataset.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning datasets.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningDatasetService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-dataset';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning datasets
     * @return {Observable<LearningDataset[]>}
     */
    getAllLearningDatasets(): Observable<LearningDataset[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<LearningDataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((dataset: any) => new LearningDataset(dataset));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves learning datasets by data transformation ID
     * @param dataTransformationId Id of the data transformation
     * @return {Observable<LearningDataset[]>}
     */
    getLearningDatasetsByTransformationId(dataTransformationId: number): Observable<LearningDataset[]> {
        const url = `${this.endpoint}/transformation/${dataTransformationId}`;
        return this.httpClient.get<LearningDataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((dataset: any) => new LearningDataset(dataset));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves learning datasets by dataset ID
     * @param datasetId Id of the dataset
     * @return {Observable<LearningDataset[]>}
     */
    getLearningDatasetsByDatasetId(datasetId: number): Observable<LearningDataset[]> {
        const url = `${this.endpoint}/dataset/${datasetId}`;
        return this.httpClient.get<LearningDataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((dataset: any) => new LearningDataset(dataset));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning dataset by ID
     * @param id Id of the learning dataset
     * @return {Observable<LearningDataset>}
     */
    getLearningDatasetById(id: number): Observable<LearningDataset> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<LearningDataset>(url)
            .pipe(
                map((response: any) => {
                    return new LearningDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning dataset
     * @param learningDataset learning dataset to be created
     * @return {Observable<LearningDataset>}
     */
    createLearningDataset(learningDataset: LearningDataset): Observable<LearningDataset> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<LearningDataset>(url, learningDataset)
            .pipe(
                map((response: any) => {
                    return new LearningDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning dataset
     * @param learningDataset updated version of the learning dataset
     * @return {Observable<LearningDataset>}
     */
    updateLearningDataset(learningDataset: LearningDataset): Observable<LearningDataset> {
        const url = `${this.endpoint}/${learningDataset.learningDatasetId}`;
        return this.httpClient.put<LearningDataset>(url, learningDataset)
            .pipe(
                map((response: any) => {
                    return new LearningDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning dataset
     * @param id Id of the learning dataset
     * @return {Observable<any>}
     */
    deleteLearningDataset(id: number): Observable<any> {
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
