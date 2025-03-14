import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Feature } from "../../shared/models/feature.model";
import { environment } from "../../../environments/environment";
import {StorageUtil} from "./storageUtil.service";

/**
 * Service to manage features.
 */
@Injectable({
    providedIn: 'root'
})
export class FeatureService {

    readonly endpoint = environment.PASSPORT_API_URL + '/feature';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all features
     * @return {Observable<Feature[]>}
     */
    getAllFeatures(studyId: String): Observable<Feature[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Feature[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((feature: any) => new Feature(feature));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a feature by id
     * @param id Id of the feature
     * @param studyId
     * @return {Observable<Feature>}
     */
    getFeatureById(id: String, studyId: String): Observable<Feature> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<Feature>(url)
            .pipe(
                map((response: any) =>{
                    return new Feature(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves features by feature set id
     * @param featureSetId Id of the feature set
     * @param studyId
     * @return {Observable<Feature[]>}
     */
    getFeaturesByFeatureSetId(featureSetId: String, studyId: String): Observable<Feature[]> {
        const url = `${this.endpoint}?featuresetId=${featureSetId}&studyId=${studyId}`;
        return this.httpClient.get<Feature[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((feature: any) => new Feature(feature));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a feature
     * @param feature feature to be created
     * @param studyId
     * @return {Observable<Feature>}
     */
    createFeature(feature: Feature, studyId: String): Observable<Feature> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        feature.createdBy = StorageUtil.retrieveUserId();
        feature.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.post<Feature>(url, feature)
            .pipe(
                map((response: any) =>{
                    return new Feature(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a feature
     * @param feature updated version of the feature
     * @param studyId
     * @return {Observable<Feature>}
     */
    updateFeature(feature: Feature, studyId: String): Observable<Feature> {
        const url = `${this.endpoint}/${feature.featureId}?studyId=${studyId}`;
        feature.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.put<Feature>(url, feature)
            .pipe(
                map((response: any) =>{
                    return new Feature(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a feature
     * @param id Id of the feature
     * @param studyId
     * @return {Observable<any>}
     */
    deleteFeature(id: String, studyId: String): Observable<any>{
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
