import {Injectable, Injector} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Parameter} from "../../shared/models/parameter.model";


/**
 * Service to manage the parameter.
 */
@Injectable({
    providedIn: 'root'
})
export class ParameterService {

    readonly endpoint = environment.PASSPORT_API_URL + '/parameter';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all parameters by studyId in database
     * @param studyId The ID of the study
     * @return {Observable<Parameter[]>}
     */
    getAllParametersByStudyId(studyId: number): Observable<Parameter[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Parameter[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((parameter: any) => new Parameter(parameter));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a parameter by id
     * @param id Id of the parameter
     * @param studyId
     * @return {Observable<Parameter>}
     */
    getParameterById(id: number, studyId: number): Observable<Parameter> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<Parameter>(url)
            .pipe(
                map((response: any) =>{
                    return new Parameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a parameter
     * @param parameter parameter to be created
     * @param studyId
     * @return {Observable<Parameter>}
     */
    createParameter(parameter: Parameter, studyId: number): Observable<Parameter> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<Parameter>(url, parameter)
            .pipe(
                map((response: any) =>{
                    return new Parameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update parameter
     * @param parameter updated version of the parameter
     * @param studyId
     * @return {Observable<Parameter>}
     */
    updateParameter(parameter: Parameter, studyId: number): Observable<Parameter> {
        const url = `${this.endpoint}/${parameter.parameterId}?studyId=${studyId}`;
        return this.httpClient.put<Parameter>(url, parameter)
            .pipe(
                map((response: any) =>{
                    return new Parameter(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a parameter
     * @param id Id of the parameter
     * @param studyId
     * @return {Observable<any>}
     */
    deleteParameter(id: number, studyId: number): Observable<any>{
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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