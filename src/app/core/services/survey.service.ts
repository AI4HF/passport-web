import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Survey} from "../../shared/models/survey.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the survey.
 */
@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    readonly endpoint = environment.PASSPORT_API_URL + '/survey';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all surveys in database
     * @return {Observable<Survey[]>}
     */
    getAllSurveys(): Observable<Survey[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Survey[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((survey: any) => new Survey(survey));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a survey by id
     * @param id Id of the survey
     * @param studyId
     * @return {Observable<Survey>}
     */
    getSurveyById(id: String, studyId: String): Observable<Survey> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<Survey>(url)
            .pipe(
                map((response: any) =>{
                    return new Survey(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves surveys of a study
     * @param studyId Id of the study
     * @return {Observable<Survey[]>}
     */
    getSurveysByStudyId(studyId: String): Observable<Survey[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Survey[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((survey: any) => new Survey(survey));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a survey
     * @param survey survey to be created
     * @param studyId
     * @return {Observable<Survey>}
     */
    createSurvey(survey: Survey, studyId: String): Observable<Survey> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<Survey>(url, survey)
            .pipe(
                map((response: any) =>{
                    return new Survey(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update survey
     * @param survey updated version of the survey
     * @param studyId
     * @return {Observable<Survey>}
     */
    updateSurvey(survey: Survey, studyId: String): Observable<Survey> {
        const url = `${this.endpoint}/${survey.surveyId}?studyId=${studyId}`;
        return this.httpClient.put<Survey>(url, survey)
            .pipe(
                map((response: any) =>{
                    return new Survey(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a survey
     * @param id Id of the survey
     * @param studyId
     * @return {Observable<any>}
     */
    deleteSurvey(id: String, studyId:String): Observable<any>{
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