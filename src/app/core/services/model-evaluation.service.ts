import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ModelEvaluation } from "../../shared/models/modelEvaluation.model";

/**
 * Service to manage the evaluation runs of a model.
 */
@Injectable({
    providedIn: 'root'
})
export class ModelEvaluationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/model-evaluation';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves an evaluation run by id
     * @param modelEvaluationId Id of the evaluation run
     * @param studyId Id of the related study
     * @return {Observable<ModelEvaluation>}
     */
    getModelEvaluationById(modelEvaluationId: String, studyId: String): Observable<ModelEvaluation> {
        const url = `${this.endpoint}/${modelEvaluationId}?studyId=${studyId}`;
        return this.httpClient.get<ModelEvaluation>(url)
            .pipe(
                map((response: any) => {
                    return new ModelEvaluation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the evaluation runs of a model
     * @param modelId Id of the model
     * @param studyId Id of the related study
     * @return {Observable<ModelEvaluation[]>}
     */
    getModelEvaluationsByModelId(modelId: String, studyId: String): Observable<ModelEvaluation[]> {
        const url = `${this.endpoint}?modelId=${modelId}&studyId=${studyId}`;
        return this.httpClient.get<ModelEvaluation[]>(url)
            .pipe(
                map((response: any) => {
                    return (response || []).map((item: any) => new ModelEvaluation(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create an evaluation run
     * @param modelEvaluation ModelEvaluation to be created
     * @param studyId Id of the related study
     * @return {Observable<ModelEvaluation>}
     */
    createModelEvaluation(modelEvaluation: ModelEvaluation, studyId: String): Observable<ModelEvaluation> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<ModelEvaluation>(url, modelEvaluation)
            .pipe(
                map((response: any) => {
                    return new ModelEvaluation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update an evaluation run
     * @param modelEvaluation Updated version of the evaluation run
     * @param studyId Id of the related study
     * @return {Observable<ModelEvaluation>}
     */
    updateModelEvaluation(modelEvaluation: ModelEvaluation, studyId: String): Observable<ModelEvaluation> {
        const url = `${this.endpoint}/${modelEvaluation.modelEvaluationId}?studyId=${studyId}`;
        return this.httpClient.put<ModelEvaluation>(url, modelEvaluation)
            .pipe(
                map((response: any) => {
                    return new ModelEvaluation(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete an evaluation run by id
     * @param modelEvaluationId Id of the evaluation run
     * @param studyId Id of the related study
     * @return {Observable<any>}
     */
    deleteModelEvaluation(modelEvaluationId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${modelEvaluationId}?studyId=${studyId}`;
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
