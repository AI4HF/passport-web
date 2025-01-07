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
     * @param studyId
     * @return {Observable<LearningStageParameter>}
     */
    getLearningStageParameterById(learningStageId: number, parameterId: number, studyId: String): Observable<LearningStageParameter> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}&parameterId=${parameterId}&studyId=${+studyId}`;
        return this.httpClient.get<LearningStageParameter>(url)
            .pipe(
                map((response: any) => {
                    return new LearningStageParameter(response[0]);
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
     * @param studyId
     * @return {Observable<LearningStageParameter>}
     */
    getLearningStageParametersByStageId(learningStageId: number, studyId: String): Observable<LearningStageParameter[]> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}&studyId=${+studyId}`;
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
     * @param studyId
     * @return {Observable<LearningStageParameter>}
     */
    createLearningStageParameter(learningStageParameter: LearningStageParameter, studyId: String): Observable<LearningStageParameter> {
        const url = `${this.endpoint}?studyId=${+studyId}`;
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
     * @param studyId
     * @return {Observable<LearningStageParameter>}
     */
    updateLearningStageParameter(learningStageParameter: LearningStageParameter, studyId: String): Observable<LearningStageParameter> {
        const url = `${this.endpoint}?learningStageId=${learningStageParameter.learningStageId}&parameterId=${learningStageParameter.parameterId}&studyId=${+studyId}`;
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
     * @param studyId
     * @return {Observable<any>}
     */
    deleteLearningStageParameter(learningStageId: number, parameterId: number, studyId: String): Observable<any> {
        const url = `${this.endpoint}?learningStageId=${learningStageId}&parameterId=${parameterId}&studyId=${+studyId}`;
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
