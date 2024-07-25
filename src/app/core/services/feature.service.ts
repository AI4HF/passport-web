import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Feature } from "../../shared/models/feature.model";
import { environment } from "../../../environments/environment";

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
    getAllFeatures(): Observable<Feature[]> {
        const url = `${this.endpoint}`;
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
     * @return {Observable<Feature>}
     */
    getFeatureById(id: number): Observable<Feature> {
        const url = `${this.endpoint}/${id}`;
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
     * @return {Observable<Feature[]>}
     */
    getFeaturesByFeatureSetId(featureSetId: number): Observable<Feature[]> {
        const url = `${this.endpoint}?featuresetId=${featureSetId}`;
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
     * @return {Observable<Feature>}
     */
    createFeature(feature: Feature): Observable<Feature> {
        const url = `${this.endpoint}`;
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
     * @return {Observable<Feature>}
     */
    updateFeature(feature: Feature): Observable<Feature> {
        const url = `${this.endpoint}/${feature.featureId}`;
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
     * @return {Observable<any>}
     */
    deleteFeature(id: number): Observable<any>{
        const url = `${this.endpoint}/${id}`;
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
