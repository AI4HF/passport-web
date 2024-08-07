import {Injectable, Injector} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Model} from "../../shared/models/model.model";
import {StorageUtil} from "./storageUtil.service";


/**
 * Service to manage the model.
 */
@Injectable({
    providedIn: 'root'
})
export class ModelService {

    readonly endpoint = environment.PASSPORT_API_URL + '/model';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }


    /**
     * Retrieves all models
     * @return {Observable<Model[]>}
     */
    getModelList(): Observable<Model[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Model[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((model: any) => new Model(model));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }



    /**
     * Retrieves all models by study ID
     * @param studyId ID of the study
     * @return {Observable<Model[]>}
     */
    getModelsByStudyId(studyId: number): Observable<Model[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Model[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((model: any) => new Model(model));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a model by id
     * @param id Id of the model
     * @return {Observable<Model>}
     */
    getModelById(id: number): Observable<Model> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Model>(url)
            .pipe(
                map((response: any) =>{
                    return new Model(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a model
     * @param model model to be created
     * @return {Observable<Model>}
     */
    createModel(model: Model): Observable<Model> {
        const url = `${this.endpoint}`;
        model.createdBy = StorageUtil.retrieveUserId();
        model.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.post<Model>(url, model)
            .pipe(
                map((response: any) =>{
                    return new Model(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update model
     * @param model updated version of the model
     * @return {Observable<Model>}
     */
    updateModel(model: Model): Observable<Model> {
        const url = `${this.endpoint}/${model.modelId}`;
        model.lastUpdatedBy = StorageUtil.retrieveUserId();
        return this.httpClient.put<Model>(url, model)
            .pipe(
                map((response: any) =>{
                    return new Model(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a model
     * @param id Id of the model
     * @return {Observable<any>}
     */
    deleteModel(id: number): Observable<any>{
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