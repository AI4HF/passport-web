import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningDataset } from "../../shared/models/learningDataset.model";
import { environment } from "../../../environments/environment";
import {
    LearningDatasetAndTransformationRequest
} from "../../shared/models/learningDatasetAndTransformationRequest.model";

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
     * Retrieves all learning datasets by studyId
     * @param studyId The ID of the study
     * @return {Observable<LearningDataset[]>}
     */
    getAllLearningDatasetsByStudyId(studyId: number): Observable<LearningDataset[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
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
        const url = `${this.endpoint}?dataTransformationId=${dataTransformationId}`;
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
        const url = `${this.endpoint}?datasetId=${datasetId}`;
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
     * Updates both learning dataset and dataset transformation in a single transaction.
     * @param learningDatasetId Id of the learning dataset to be updated
     * @param request LearningDatasetAndTransformationRequest containing updated LearningDataset and DatasetTransformation.
     * @return {Observable<LearningDatasetAndTransformationRequest>}
     */
    updateLearningDatasetWithTransformation(learningDatasetId: number, request: LearningDatasetAndTransformationRequest): Observable<LearningDatasetAndTransformationRequest> {
        const url = `${this.endpoint}/${learningDatasetId}`;
        return this.httpClient.put<LearningDatasetAndTransformationRequest>(url, request)
            .pipe(
                map((response: any) => {
                    return new LearningDatasetAndTransformationRequest(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }



    /**
     * Creates a LearningDataset and DatasetTransformation in a single transaction.
     * @param request the request containing both LearningDataset and DatasetTransformation
     * @return the saved LearningDataset and DatasetTransformation
     */
    createLearningDatasetWithTransformation(request: LearningDatasetAndTransformationRequest): Observable<LearningDatasetAndTransformationRequest> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<LearningDatasetAndTransformationRequest>(url, request)
            .pipe(
                map((response: any) => {
                    return new LearningDatasetAndTransformationRequest(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}