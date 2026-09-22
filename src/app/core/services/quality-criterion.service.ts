import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { QualityCriterion } from "../../shared/models/qualityCriterion.model";

/**
 * Service to read the rules of a quality criteria set.
 */
@Injectable({
    providedIn: 'root'
})
export class QualityCriterionService {
    readonly endpoint = environment.PASSPORT_API_URL + '/quality-criterion';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the rules of a criteria set
     * @param qualityCriteriaId Id of the criteria set
     * @param studyId Id of the study
     */
    getQualityCriterionList(qualityCriteriaId: String, studyId: String): Observable<QualityCriterion[]> {
        const url = `${this.endpoint}?qualityCriteriaId=${qualityCriteriaId}&studyId=${studyId}`;
        return this.httpClient.get<QualityCriterion[]>(url).pipe(
            map((response: any) => response.map((c: any) => new QualityCriterion(c))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
