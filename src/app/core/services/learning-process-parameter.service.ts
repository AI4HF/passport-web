import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningProcessParameter } from "../../shared/models/learningProcessParameter.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning process parameters.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningProcessParameterService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-process-parameter';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning process parameters
     * @return {Observable<LearningProcessParameter[]>}
     */
    getAllLearningProcessParameters(): Observable<LearningProcessParameter[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<LearningProcessParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningProcessParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves learning process parameters by learning process id
     * @return {Observable<LearningProcessParameter[]>}
     */
    getLearningProcessParametersByProcessId(learningProcessId: number): Observable<LearningProcessParameter[]> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}`;
        return this.httpClient.get<LearningProcessParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningProcessParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning process parameter by composite id
     * @param learningProcessId Id of the learning process
     * @param parameterId Id of the parameter
     * @return {Observable<LearningProcessParameter>}
     */
    getLearningProcessParameterById(learningProcessId: number, parameterId: number): Observable<LearningProcessParameter> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}&parameterId=${parameterId}`;
        return this.httpClient.get<LearningProcessParameter>(url)
            .pipe(
                map((response: any) => {
                    return new LearningProcessParameter(response[0]);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning process parameter
     * @param learningProcessParameter LearningProcessParameter to be created
     * @return {Observable<LearningProcessParameter>}
     */
    createLearningProcessParameter(learningProcessParameter: LearningProcessParameter): Observable<LearningProcessParameter> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<LearningProcessParameter>(url, learningProcessParameter)
            .pipe(
                map((response: any) => {
                    return new LearningProcessParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning process parameter
     * @param learningProcessParameter Updated version of the learning process parameter
     * @return {Observable<LearningProcessParameter>}
     */
    updateLearningProcessParameter(learningProcessParameter: LearningProcessParameter): Observable<LearningProcessParameter> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessParameter.learningProcessId}&parameterId=${learningProcessParameter.parameterId}`;
        return this.httpClient.put<LearningProcessParameter>(url, learningProcessParameter)
            .pipe(
                map((response: any) => {
                    return new LearningProcessParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning process parameter by composite id
     * @param learningProcessId Id of the learning process
     * @param parameterId Id of the parameter
     * @return {Observable<any>}
     */
    deleteLearningProcessParameter(learningProcessId: number, parameterId: number): Observable<any> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}&parameterId=${parameterId}`;
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
