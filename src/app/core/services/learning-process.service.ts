import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LearningProcess } from "../../shared/models/learningProcess.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage learning processes.
 */
@Injectable({
    providedIn: 'root'
})
export class LearningProcessService {

    readonly endpoint = environment.PASSPORT_API_URL + '/learning-process';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all learning processes by studyId
     * @param studyId Id of the study
     * @return {Observable<LearningProcess[]>}
     */
    getAllLearningProcessesByStudyId(studyId: String): Observable<LearningProcess[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<LearningProcess[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((item: any) => new LearningProcess(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a learning process by id
     * @param id Id of the learning process
     * @param studyId
     * @return {Observable<LearningProcess>}
     */
    getLearningProcessById(id: String, studyId: String): Observable<LearningProcess> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<LearningProcess>(url)
            .pipe(
                map((response: any) => {
                    return new LearningProcess(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a learning process
     * @param learningProcess LearningProcess to be created
     * @param studyId
     * @return {Observable<LearningProcess>}
     */
    createLearningProcess(learningProcess: LearningProcess, studyId: String): Observable<LearningProcess> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<LearningProcess>(url, learningProcess)
            .pipe(
                map((response: any) => {
                    return new LearningProcess(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a learning process
     * @param learningProcess Updated version of the learning process
     * @param studyId
     * @return {Observable<LearningProcess>}
     */
    updateLearningProcess(learningProcess: LearningProcess, studyId: String): Observable<LearningProcess> {
        const url = `${this.endpoint}/${learningProcess.learningProcessId}?studyId=${studyId}`;
        return this.httpClient.put<LearningProcess>(url, learningProcess)
            .pipe(
                map((response: any) => {
                    return new LearningProcess(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a learning process
     * @param id Id of the learning process
     * @return {Observable<any>}
     */
    deleteLearningProcess(id: String): Observable<any> {
        const url = `${this.endpoint}/${id}`;
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

    /**
     * Validates if a learning process deletion is safe regarding cascading permissions.
     * @param learningProcessId Id of the learning process
     * @param studyId ID of the study
     * @return {Observable<any>}
     */
    validateLearningProcessDeletion(learningProcessId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${learningProcessId}/validate-deletion?studyId=${studyId}`;
        return this.httpClient.get(url, { responseType: 'text' })
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }
}
