import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { FeatureSet } from "../../shared/models/featureset.model";
import { environment } from "../../../environments/environment";
import {StorageUtil} from "./storageUtil.service";

/**
 * Service to manage feature sets.
 */
@Injectable({
    providedIn: 'root'
})
export class FeatureSetService {

    readonly endpoint = environment.PASSPORT_API_URL + '/featureset';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all feature sets by studyId
     * @param studyId Id of the study
     * @return {Observable<FeatureSet[]>}
     */
    getAllFeatureSetsByStudyId(studyId: String): Observable<FeatureSet[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<FeatureSet[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((featureSet: any) => new FeatureSet(featureSet));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a feature set by id
     * @param id Id of the feature set
     * @param studyId
     * @return {Observable<FeatureSet>}
     */
    getFeatureSetById(id: String, studyId: String): Observable<FeatureSet> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<FeatureSet>(url)
            .pipe(
                map((response: any) =>{
                    return new FeatureSet(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a feature set
     * @param featureSet feature set to be created
     * @param studyId
     * @return {Observable<FeatureSet>}
     */
    createFeatureSet(featureSet: FeatureSet, studyId: String): Observable<FeatureSet> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        featureSet.createdBy = StorageUtil.retrieveUserId();
        featureSet.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.post<FeatureSet>(url, featureSet)
            .pipe(
                map((response: any) =>{
                    return new FeatureSet(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a feature set
     * @param featureSet updated version of the feature set
     * @param studyId
     * @return {Observable<FeatureSet>}
     */
    updateFeatureSet(featureSet: FeatureSet, studyId: String): Observable<FeatureSet> {
        const url = `${this.endpoint}/${featureSet.featuresetId}?studyId=${studyId}`;
        featureSet.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.put<FeatureSet>(url, featureSet)
            .pipe(
                map((response: any) =>{
                    return new FeatureSet(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a feature set
     * @param id Id of the feature set
     * @param studyId
     * @return {Observable<any>}
     */
    deleteFeatureSet(id: String, studyId: String): Observable<any>{
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.delete<any>(url)
            .pipe(
                map((response: any) =>{
                    return response;
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
