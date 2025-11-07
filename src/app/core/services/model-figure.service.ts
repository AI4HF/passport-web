import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ModelFigure } from "../../shared/models/modelFigure.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage model figures.
 */
@Injectable({
    providedIn: 'root'
})
export class ModelFigureService {

    readonly endpoint = environment.PASSPORT_API_URL + '/model-figure';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves model figures by model id
     * @param modelId Id of the model
     * @param studyId Id of the related study
     * @return {Observable<ModelFigure[]>}
     */
    getModelFiguresByModelId(modelId: String, studyId: String): Observable<ModelFigure[]> {
        const url = `${this.endpoint}?modelId=${modelId}&studyId=${studyId}`;
        return this.httpClient.get<ModelFigure>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new ModelFigure(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a model figure
     * @param modelFigure ModelFigure to be created
     * @param studyId Id of the related study
     * @return {Observable<ModelFigure>}
     */
    createModelFigure(modelFigure: ModelFigure, studyId: String): Observable<ModelFigure> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<ModelFigure>(url, modelFigure)
            .pipe(
                map((response: any) => {
                    return new ModelFigure(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a model figure
     * @param modelFigure Updated version of the model figure
     * @param studyId Id of the related study
     * @return {Observable<ModelFigure>}
     */
    updateModelFigure(modelFigure: ModelFigure, studyId: String): Observable<ModelFigure> {
        const url = `${this.endpoint}?figureId=${modelFigure.figureId}&studyId=${studyId}`;
        return this.httpClient.put<ModelFigure>(url, modelFigure)
            .pipe(
                map((response: any) => {
                    return new ModelFigure(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a model figure by figure id
     * @param figureId Id of the figure
     * @param studyId Id of the related study
     * @return {Observable<any>}
     */
    deleteModelFigure(figureId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}?figureId=${figureId}&studyId=${studyId}`;
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
