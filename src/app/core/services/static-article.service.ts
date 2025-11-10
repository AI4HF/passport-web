import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {StaticArticle} from "../../shared/models/staticArticle.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the Static Articles.
 */
@Injectable({
    providedIn: 'root'
})
export class StaticArticleService {

    readonly endpoint = environment.PASSPORT_API_URL + '/staticArticle';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Fetch Static Articles by Study ID
     * @param studyId Study identifier
     */
    getStaticArticlesByStudyId(studyId: string): Observable<StaticArticle[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<StaticArticle[]>(url)
            .pipe(
                map((response: any) => {
                    return (response || []).map((sa: any) => new StaticArticle(sa));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create Static Articles for a Study in bulk
     * @param studyId Study identifier
     * @param items Array of StaticArticle models
     */
    createStaticArticles(studyId: string, items: StaticArticle[]): Observable<StaticArticle[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<StaticArticle[]>(url, items)
            .pipe(
                map((response: any) => {
                    return (response || []).map((sa: any) => new StaticArticle(sa));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
