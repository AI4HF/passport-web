import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {EvaluationMeasure} from "../../shared/models/evaluationMeasure.model";

/**
 * Service to manage model evaluation measures.
 */
@Injectable({
    providedIn: 'root'
})
export class EvaluationMeasureService {

    readonly endpoint = environment.PASSPORT_API_URL + '/evaluation-measure';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves an evaluation measure by id
     * @param evaluationMeasureId Id of the evaluation measure
     * @param studyId Id of the related study
     * @return {Observable<EvaluationMeasure>}
     */
    getEvaluationMeasureById(evaluationMeasureId: String, studyId: String): Observable<EvaluationMeasure> {
        const url = `${this.endpoint}/${evaluationMeasureId}?studyId=${studyId}`;
        return this.httpClient.get<EvaluationMeasure>(url)
            .pipe(
                map((response: any) => {
                    return new EvaluationMeasure(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves related evaluation measures by model id
     * @param modelId Id of the model
     * @param studyId Id of the related study
     * @return {Observable<EvaluationMeasure>}
     */
    getEvaluationMeasuresByModelId(modelId: String, studyId: String): Observable<EvaluationMeasure[]> {
        const url = `${this.endpoint}?modelId=${modelId}&studyId=${studyId}`;
        return this.httpClient.get<EvaluationMeasure[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new EvaluationMeasure(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create an evaluation measure
     * @param evaluationMeasure EvaluationMeasure to be created
     * @param studyId Id of the related study
     * @return {Observable<EvaluationMeasure>}
     */
    createEvaluationMeasure(evaluationMeasure: EvaluationMeasure, studyId: String): Observable<EvaluationMeasure> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<EvaluationMeasure>(url, evaluationMeasure)
            .pipe(
                map((response: any) => {
                    return new EvaluationMeasure(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update an evaluation measure
     * @param evaluationMeasure Updated version of the evaluation measure
     * @param studyId Id of the related study
     * @return {Observable<EvaluationMeasure>}
     */
    updateEvaluationMeasure(evaluationMeasure: EvaluationMeasure, studyId: String): Observable<EvaluationMeasure> {
        const url = `${this.endpoint}/${evaluationMeasure.measureId}?studyId=${studyId}`;
        return this.httpClient.put<EvaluationMeasure>(url, evaluationMeasure)
            .pipe(
                map((response: any) => {
                    return new EvaluationMeasure(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete an evaluation measure by id
     * @param evaluationMeasureId Id of the evaluation measure
     * @param studyId Id of the related study
     * @return {Observable<any>}
     */
    deleteEvaluationMeasure(evaluationMeasureId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${evaluationMeasureId}?studyId=${studyId}`;
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
