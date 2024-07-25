import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { DatasetTransformationStep } from "../../shared/models/datasetTransformationStep.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage dataset transformation steps.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetTransformationStepService {

    readonly endpoint = environment.PASSPORT_API_URL + '/dataset-transformation-step';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all dataset transformation steps
     * @return {Observable<DatasetTransformationStep[]>}
     */
    getAllDatasetTransformationSteps(): Observable<DatasetTransformationStep[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<DatasetTransformationStep[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((step: any) => new DatasetTransformationStep(step));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves dataset transformation steps by data transformation ID
     * @param dataTransformationId Id of the data transformation
     * @return {Observable<DatasetTransformationStep[]>}
     */
    getDatasetTransformationStepsByTransformationId(dataTransformationId: number): Observable<DatasetTransformationStep[]> {
        const url = `${this.endpoint}?dataTransformationId=${dataTransformationId}`;
        return this.httpClient.get<DatasetTransformationStep[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((step: any) => new DatasetTransformationStep(step));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a dataset transformation step by ID
     * @param id Id of the dataset transformation step
     * @return {Observable<DatasetTransformationStep>}
     */
    getDatasetTransformationStepById(id: number): Observable<DatasetTransformationStep> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<DatasetTransformationStep>(url)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformationStep(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a dataset transformation step
     * @param datasetTransformationStep dataset transformation step to be created
     * @return {Observable<DatasetTransformationStep>}
     */
    createDatasetTransformationStep(datasetTransformationStep: DatasetTransformationStep): Observable<DatasetTransformationStep> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<DatasetTransformationStep>(url, datasetTransformationStep)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformationStep(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a dataset transformation step
     * @param datasetTransformationStep updated version of the dataset transformation step
     * @return {Observable<DatasetTransformationStep>}
     */
    updateDatasetTransformationStep(datasetTransformationStep: DatasetTransformationStep): Observable<DatasetTransformationStep> {
        const url = `${this.endpoint}/${datasetTransformationStep.stepId}`;
        return this.httpClient.put<DatasetTransformationStep>(url, datasetTransformationStep)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformationStep(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a dataset transformation step
     * @param id Id of the dataset transformation step
     * @return {Observable<any>}
     */
    deleteDatasetTransformationStep(id: number): Observable<any> {
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
