import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningProcessDataset } from "../../shared/models/learningProcessDataset.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning process datasets.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningProcessDatasetService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-process-dataset';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning process datasets
     * @return {Observable<LearningProcessDataset[]>}
     */
    getAllLearningProcessDatasets(): Observable<LearningProcessDataset[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<LearningProcessDataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningProcessDataset(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning process dataset by composite id
     * @param learningProcessId Id of the learning process
     * @param learningDatasetId Id of the learning dataset
     * @return {Observable<LearningProcessDataset>}
     */
    getLearningProcessDatasetById(learningProcessId: string, learningDatasetId: string): Observable<LearningProcessDataset> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}&learningDatasetId=${learningDatasetId}`;
        return this.httpClient.get<LearningProcessDataset>(url)
            .pipe(
                map((response: any) => {
                    return new LearningProcessDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves learning process datasets by learning process id
     * @param learningProcessId Id of the learning process
     * @return {Observable<LearningProcessDataset>}
     */
    getLearningProcessDatasetsByLearningProcessId(learningProcessId: string): Observable<LearningProcessDataset[]> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}`;
        return this.httpClient.get<LearningProcessDataset[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningProcessDataset(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning process dataset
     * @param learningProcessDataset LearningProcessDataset to be created
     * @return {Observable<LearningProcessDataset>}
     */
    createLearningProcessDataset(learningProcessDataset: LearningProcessDataset): Observable<LearningProcessDataset> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<LearningProcessDataset>(url, learningProcessDataset)
            .pipe(
                map((response: any) => {
                    return new LearningProcessDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning process dataset
     * @param learningProcessDataset Updated version of the learning process dataset
     * @return {Observable<LearningProcessDataset>}
     */
    updateLearningProcessDataset(learningProcessDataset: LearningProcessDataset): Observable<LearningProcessDataset> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessDataset.learningProcessId}&learningDatasetId=${learningProcessDataset.learningDatasetId}`;
        return this.httpClient.put<LearningProcessDataset>(url, learningProcessDataset)
            .pipe(
                map((response: any) => {
                    return new LearningProcessDataset(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning process dataset by composite id
     * @param learningProcessId Id of the learning process
     * @param learningDatasetId Id of the learning dataset
     * @return {Observable<any>}
     */
    deleteLearningProcessDataset(learningProcessId: string, learningDatasetId: string): Observable<any> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}&learningDatasetId=${learningDatasetId}`;
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
