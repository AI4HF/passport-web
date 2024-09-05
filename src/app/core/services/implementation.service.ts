import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Implementation } from "../../shared/models/implementation.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage implementations.
 */
@Injectable({
    providedIn: 'root'
})
export class ImplementationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/implementation';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all implementations
     * @return {Observable<Implementation[]>}
     */
    getAllImplementations(): Observable<Implementation[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Implementation[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new Implementation(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves an implementation by id
     * @param id Id of the implementation
     * @return {Observable<Implementation>}
     */
    getImplementationById(id: number): Observable<Implementation> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Implementation>(url)
            .pipe(
                map((response: any) => {
                    return new Implementation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create an implementation
     * @param implementation Implementation to be created
     * @return {Observable<Implementation>}
     */
    createImplementation(implementation: Implementation): Observable<Implementation> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<Implementation>(url, implementation)
            .pipe(
                map((response: any) => {
                    return new Implementation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update an implementation
     * @param implementation Updated version of the implementation
     * @return {Observable<Implementation>}
     */
    updateImplementation(implementation: Implementation): Observable<Implementation> {
        const url = `${this.endpoint}/${implementation.implementationId}`;
        return this.httpClient.put<Implementation>(url, implementation)
            .pipe(
                map((response: any) => {
                    return new Implementation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete an implementation
     * @param id Id of the implementation
     * @return {Observable<any>}
     */
    deleteImplementation(id: number): Observable<any> {
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
