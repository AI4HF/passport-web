import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ModelParameter } from "../../shared/models/modelParameter.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage model parameters.
 */
@Injectable({
    providedIn: 'root'
})
export class ModelParameterService {

    readonly endpoint = environment.PASSPORT_API_URL + '/model-parameter';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all model parameters
     * @return {Observable<ModelParameter[]>}
     */
    getAllModelParameters(): Observable<ModelParameter[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<ModelParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new ModelParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a model parameter by composite id
     * @param modelId Id of the model
     * @param parameterId Id of the parameter
     * @param studyId Id of the related study
     * @return {Observable<ModelParameter>}
     */
    getModelParameterById(modelId: String, parameterId: String, studyId: String): Observable<ModelParameter> {
        const url = `${this.endpoint}?modelId=${modelId}&parameterId=${parameterId}&studyId=${studyId}`;
        return this.httpClient.get<ModelParameter>(url)
            .pipe(
                map((response: any) => {
                    return new ModelParameter(response[0]);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a model parameter by model id
     * @param modelId Id of the model
     * @param studyId Id of the related study
     * @return {Observable<ModelParameter>}
     */
    getModelParametersByModelId(modelId: String, studyId: String): Observable<ModelParameter[]> {
        const url = `${this.endpoint}?modelId=${modelId}&studyId=${studyId}`;
        return this.httpClient.get<ModelParameter[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new ModelParameter(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a model parameter
     * @param modelParameter ModelParameter to be created
     * @param studyId Id of the related study
     * @return {Observable<ModelParameter>}
     */
    createModelParameter(modelParameter: ModelParameter, studyId: String): Observable<ModelParameter> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<ModelParameter>(url, modelParameter)
            .pipe(
                map((response: any) => {
                    return new ModelParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a model parameter
     * @param modelParameter Updated version of the model parameter
     * @param studyId Id of the related study
     * @return {Observable<ModelParameter>}
     */
    updateModelParameter(modelParameter: ModelParameter, studyId: String): Observable<ModelParameter> {
        const url = `${this.endpoint}?modelId=${modelParameter.modelId}&parameterId=${modelParameter.parameterId}&studyId=${studyId}`;
        return this.httpClient.put<ModelParameter>(url, modelParameter)
            .pipe(
                map((response: any) => {
                    return new ModelParameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a model parameter by composite id
     * @param modelId Id of the model
     * @param parameterId Id of the parameter
     * @param studyId Id of the related study
     * @return {Observable<any>}
     */
    deleteModelParameter(modelId: String, parameterId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}?modelId=${modelId}&parameterId=${parameterId}&studyId=${studyId}`;
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
