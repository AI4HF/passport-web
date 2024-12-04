import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { DatasetCharacteristic } from "../../shared/models/datasetCharacteristic.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage dataset characteristics.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetCharacteristicService {

    readonly endpoint = environment.PASSPORT_API_URL + '/feature-dataset-characteristic';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all dataset characteristics
     * @return {Observable<DatasetCharacteristic[]>}
     */
    getAll(): Observable<DatasetCharacteristic[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<DatasetCharacteristic[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new DatasetCharacteristic(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves dataset characteristics by dataset id
     * @param datasetId Id of the dataset
     * @param studyId
     * @return {Observable<DatasetCharacteristic[]>}
     */
    getCharacteristicsByDatasetId(datasetId: number, studyId: number): Observable<DatasetCharacteristic[]> {
        const url = `${this.endpoint}?datasetId=${datasetId}&studyId=${studyId}`;
        return this.httpClient.get<DatasetCharacteristic[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new DatasetCharacteristic(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a dataset characteristic
     * @param characteristic dataset characteristic to be created
     * @param studyId
     * @return {Observable<DatasetCharacteristic>}
     */
    createCharacteristic(characteristic: DatasetCharacteristic, studyId: number): Observable<DatasetCharacteristic> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<DatasetCharacteristic>(url, characteristic)
            .pipe(
                map((response: any) => {
                    return new DatasetCharacteristic(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a dataset characteristic
     * @param characteristic updated version of the dataset characteristic
     * @param studyId
     * @return {Observable<DatasetCharacteristic>}
     */
    updateCharacteristic(characteristic: DatasetCharacteristic, studyId: number): Observable<DatasetCharacteristic> {
        const url = `${this.endpoint}?datasetId=${characteristic.datasetId}&featureId=${characteristic.featureId}&studyId=${studyId}`;
        return this.httpClient.put<DatasetCharacteristic>(url, characteristic)
            .pipe(
                map((response: any) => {
                    return new DatasetCharacteristic(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a dataset characteristic
     * @param datasetId Id of the dataset
     * @param featureId Id of the feature
     * @param studyId
     * @return {Observable<any>}
     */
    deleteCharacteristic(datasetId: number, featureId: number, studyId: number): Observable<any> {
        const url = `${this.endpoint}?datasetId=${datasetId}&featureId=${featureId}&studyId=${studyId}`;
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
