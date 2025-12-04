import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { LinkedArticle } from "../../shared/models/linkedArticle.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage the Linked Articles.
 */
@Injectable({
    providedIn: 'root'
})
export class LinkedArticleService {

    readonly endpoint = environment.PASSPORT_API_URL + '/linked-article';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the linked article by using linkedArticleId
     * @param id Id of the linked article
     * @param studyId Id of the study
     * @return {Observable<LinkedArticle>}
     */
    getLinkedArticleById(id: String, studyId: String): Observable<LinkedArticle> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<LinkedArticle>(url)
            .pipe(
                map((response: any) => {
                    return new LinkedArticle(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves linked articles of a study
     * @param id Id of the study
     * @return {Observable<LinkedArticle[]>}
     */
    getLinkedArticlesByStudyId(id: String): Observable<LinkedArticle[]> {
        const url = `${this.endpoint}?studyId=${id}`;
        return this.httpClient.get<LinkedArticle[]>(url)
            .pipe(
                map((response: any) => {
                    return (response || []).map((item: any) => new LinkedArticle(item));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the linked article of a study
     * @param linkedArticle updated version of the linked article
     * @param id Id of the study
     * @return {Observable<LinkedArticle>}
     */
    updateLinkedArticle(linkedArticle: LinkedArticle, id: String): Observable<LinkedArticle> {
        const url = `${this.endpoint}/${linkedArticle.linkedArticleId}?studyId=${id}`;
        return this.httpClient.put<LinkedArticle>(url, linkedArticle)
            .pipe(
                map((response: any) => {
                    return new LinkedArticle(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a linked article for the study
     * @param linkedArticle linked article to be created
     * @param id Id of the study
     * @return {Observable<LinkedArticle>}
     */
    createLinkedArticle(linkedArticle: LinkedArticle, id: String): Observable<LinkedArticle> {
        const url = `${this.endpoint}?studyId=${id}`;
        return this.httpClient.post<LinkedArticle>(url, linkedArticle)
            .pipe(
                map((response: any) => {
                    return new LinkedArticle(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a linked article
     * @param id Id of the linked article
     * @param studyId
     * @return {Observable<any>}
     */
    deleteLinkedArticle(id: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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
