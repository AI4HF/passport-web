import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Algorithm } from "../../shared/models/algorithm.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage algorithms.
 */
@Injectable({
    providedIn: 'root'
})
export class AlgorithmService {

    readonly endpoint = environment.PASSPORT_API_URL + '/algorithm';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all algorithms
     * @return {Observable<Algorithm[]>}
     */
    getAllAlgorithms(studyId: number): Observable<Algorithm[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Algorithm[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new Algorithm(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves an algorithm by id
     * @param id Id of the algorithm
     * @return {Observable<Algorithm>}
     */
    getAlgorithmById(id: number): Observable<Algorithm> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Algorithm>(url)
            .pipe(
                map((response: any) => {
                    return new Algorithm(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create an algorithm
     * @param algorithm Algorithm to be created
     * @param studyId
     * @return {Observable<Algorithm>}
     */
    createAlgorithm(algorithm: Algorithm, studyId: number): Observable<Algorithm> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<Algorithm>(url, algorithm)
            .pipe(
                map((response: any) => {
                    return new Algorithm(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update an algorithm
     * @param algorithm Updated version of the algorithm
     * @return {Observable<Algorithm>}
     */
    updateAlgorithm(algorithm: Algorithm): Observable<Algorithm> {
        const url = `${this.endpoint}/${algorithm.algorithmId}`;
        return this.httpClient.put<Algorithm>(url, algorithm)
            .pipe(
                map((response: any) => {
                    return new Algorithm(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete an algorithm
     * @param id Id of the algorithm
     * @return {Observable<any>}
     */
    deleteAlgorithm(id: number): Observable<any> {
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
