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
     * @param studyId
     * @return {Observable<DatasetTransformation>}
     */
    getDatasetTransformationById(id: number, studyId: String): Observable<DatasetTransformation> {
        const url = `${this.endpoint}/${id}?studyId=${+studyId}`;
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
     * Delete a dataset transformation
     * @param id Id of the dataset transformation
     * @param studyId
     * @return {Observable<any>}
     */
    deleteDatasetTransformation(id: number, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${id}?studyId=${+studyId}`;
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
