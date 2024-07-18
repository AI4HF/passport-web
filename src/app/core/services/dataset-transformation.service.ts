import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { DatasetTransformation } from "../../shared/models/datasetTransformation.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage dataset transformations.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetTransformationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/dataset-transformation';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all dataset transformations
     * @return {Observable<DatasetTransformation[]>}
     */
    getAllDatasetTransformations(): Observable<DatasetTransformation[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<DatasetTransformation[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((transformation: any) => new DatasetTransformation(transformation));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a dataset transformation by ID
     * @param id Id of the dataset transformation
     * @return {Observable<DatasetTransformation>}
     */
    getDatasetTransformationById(id: number): Observable<DatasetTransformation> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<DatasetTransformation>(url)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a dataset transformation
     * @param datasetTransformation dataset transformation to be created
     * @return {Observable<DatasetTransformation>}
     */
    createDatasetTransformation(datasetTransformation: DatasetTransformation): Observable<DatasetTransformation> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<DatasetTransformation>(url, datasetTransformation)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a dataset transformation
     * @param datasetTransformation updated version of the dataset transformation
     * @return {Observable<DatasetTransformation>}
     */
    updateDatasetTransformation(datasetTransformation: DatasetTransformation): Observable<DatasetTransformation> {
        const url = `${this.endpoint}/${datasetTransformation.dataTransformationId}`;
        return this.httpClient.put<DatasetTransformation>(url, datasetTransformation)
            .pipe(
                map((response: any) => {
                    return new DatasetTransformation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a dataset transformation
     * @param id Id of the dataset transformation
     * @return {Observable<any>}
     */
    deleteDatasetTransformation(id: number): Observable<any> {
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
