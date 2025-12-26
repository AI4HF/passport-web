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
    getAllLearningDatasetsByStudyId(studyId: String): Observable<LearningDataset[]> {
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
    getLearningDatasetsByTransformationId(dataTransformationId: String): Observable<LearningDataset[]> {
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
     * @param studyId
     * @return {Observable<LearningDataset[]>}
     */
    getLearningDatasetsByDatasetId(datasetId: String, studyId: String): Observable<LearningDataset[]> {
        const url = `${this.endpoint}?datasetId=${datasetId}&studyId=${studyId}`;
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
     * @param studyId
     * @return {Observable<LearningDataset>}
     */
    getLearningDatasetById(id: String, studyId: String): Observable<LearningDataset> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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
     * @param studyId
     * @return {Observable<LearningDatasetAndTransformationRequest>}
     */
    updateLearningDatasetWithTransformation(learningDatasetId: String, request: LearningDatasetAndTransformationRequest, studyId: String): Observable<LearningDatasetAndTransformationRequest> {
        const url = `${this.endpoint}/${learningDatasetId}?studyId=${studyId}`;
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
     * @param studyId
     * @return the saved LearningDataset and DatasetTransformation
     */
    createLearningDatasetWithTransformation(request: LearningDatasetAndTransformationRequest, studyId: String): Observable<LearningDatasetAndTransformationRequest> {
        const url = `${this.endpoint}?studyId=${studyId}`;
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

    /**
     * Validates if a learning dataset deletion is safe regarding cascading permissions.
     * @param learningDatasetId Id of the learning dataset
     * @param studyId ID of the study
     * @return {Observable<any>}
     */
    validateLearningDatasetDeletion(learningDatasetId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${learningDatasetId}/validate-deletion?studyId=${studyId}`;
        return this.httpClient.get(url, { responseType: 'text' })
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }
}