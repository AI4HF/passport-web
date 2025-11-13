import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {LinkedArticle} from "../../shared/models/linkedArticle.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the Linked Articles.
 */
@Injectable({
    providedIn: 'root'
})
export class LinkedArticleService {

    readonly endpoint = environment.PASSPORT_API_URL + '/linkedArticle';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Fetch Linked Articles by Study ID
     * @param studyId Study identifier
     */
    getLinkedArticlesByStudyId(studyId: string): Observable<LinkedArticle[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<LinkedArticle[]>(url)
            .pipe(
                map((response: any) => {
                    return (response || []).map((sa: any) => new LinkedArticle(sa));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create Linked Articles for a Study in bulk
     * @param studyId Study identifier
     * @param items Array of LinkedArticle models
     */
    createLinkedArticles(studyId: string, items: LinkedArticle[]): Observable<LinkedArticle[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<LinkedArticle[]>(url, items)
            .pipe(
                map((response: any) => {
                    return (response || []).map((sa: any) => new LinkedArticle(sa));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
