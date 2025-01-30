import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningStage } from "../../shared/models/learningStage.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning stages.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningStageService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-stage';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning stages
     * @return {Observable<LearningStage[]>}
     */
    getAllLearningStages(): Observable<LearningStage[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<LearningStage[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningStage(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves all learning stages with the given process ID
     * @return {Observable<LearningStage[]>}
     */
    getLearningStagesByLearningProcessId(learningProcessId: number, studyId: String): Observable<LearningStage[]> {
        const url = `${this.endpoint}?learningProcessId=${learningProcessId}&studyId=${+studyId}`;
        return this.httpClient.get<LearningStage[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningStage(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning stage by id
     * @param id Id of the learning stage
     * @param studyId
     * @return {Observable<LearningStage>}
     */
    getLearningStageById(id: number, studyId: String): Observable<LearningStage> {
        const url = `${this.endpoint}/${id}?studyId=${+studyId}`;
        return this.httpClient.get<LearningStage>(url)
            .pipe(
                map((response: any) => {
                    return new LearningStage(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning stage
     * @param learningStage LearningStage to be created
     * @param studyId
     * @return {Observable<LearningStage>}
     */
    createLearningStage(learningStage: LearningStage, studyId: String): Observable<LearningStage> {
        const url = `${this.endpoint}?studyId=${+studyId}`;
        return this.httpClient.post<LearningStage>(url, learningStage)
            .pipe(
                map((response: any) => {
                    return new LearningStage(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning stage
     * @param learningStage Updated version of the learning stage
     * @param studyId
     * @return {Observable<LearningStage>}
     */
    updateLearningStage(learningStage: LearningStage, studyId: String): Observable<LearningStage> {
        const url = `${this.endpoint}/${learningStage.learningStageId}?studyId=${+studyId}`;
        return this.httpClient.put<LearningStage>(url, learningStage)
            .pipe(
                map((response: any) => {
                    return new LearningStage(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning stage
     * @param id Id of the learning stage
     * @param studyId
     * @return {Observable<any>}
     */
    deleteLearningStage(id: number, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${id}?studyId=${+studyId}`;
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
