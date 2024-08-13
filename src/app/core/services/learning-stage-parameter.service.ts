import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningStageParameter } from "../../shared/models/learningStageParameter.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning stage parameters.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningStageParameterService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-stage-parameter';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning stage parameters
     * @return {Observable<LearningStageParameter[]>}
     */
    getAllLearningStageParameters(): Observable<LearningStageParameter[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<LearningStageParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningStageParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning stage parameter by composite id
     * @param learningStageId Id of the learning stage
     * @param parameterId Id of the parameter
     * @return {Observable<LearningStageParameter>}
     */
    getLearningStageParameterById(learningStageId: number, parameterId: number): Observable<LearningStageParameter> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}&parameterId=${parameterId}`;
        return this.httpClient.get<LearningStageParameter>(url)
            .pipe(
                map((response: any) => {
                    return new LearningStageParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning stage parameter by learning stage id
     * @param learningStageId Id of the learning stage
     * @return {Observable<LearningStageParameter>}
     */
    getLearningStageParametersByStageId(learningStageId: number): Observable<LearningStageParameter[]> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}`;
        return this.httpClient.get<LearningStageParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningStageParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning stage parameter
     * @param learningStageParameter LearningStageParameter to be created
     * @return {Observable<LearningStageParameter>}
     */
    createLearningStageParameter(learningStageParameter: LearningStageParameter): Observable<LearningStageParameter> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<LearningStageParameter>(url, learningStageParameter)
            .pipe(
                map((response: any) => {
                    return new LearningStageParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning stage parameter
     * @param learningStageParameter Updated version of the learning stage parameter
     * @return {Observable<LearningStageParameter>}
     */
    updateLearningStageParameter(learningStageParameter: LearningStageParameter): Observable<LearningStageParameter> {
        const url = `${this.endpoint}?learningStageId=${learningStageParameter.learningStageId}&parameterId=${learningStageParameter.parameterId}`;
        return this.httpClient.put<LearningStageParameter>(url, learningStageParameter)
            .pipe(
                map((response: any) => {
                    return new LearningStageParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning stage parameter by composite id
     * @param learningStageId Id of the learning stage
     * @param parameterId Id of the parameter
     * @return {Observable<any>}
     */
    deleteLearningStageParameter(learningStageId: number, parameterId: number): Observable<any> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}&parameterId=${parameterId}`;
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
