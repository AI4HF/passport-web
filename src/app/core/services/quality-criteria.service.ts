import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { QualityCriteria } from "../../shared/models/qualityCriteria.model";

/**
 * Service to read the quality criteria sets of a study.
 */
@Injectable({
    providedIn: 'root'
})
export class QualityCriteriaService {
    readonly endpoint = environment.PASSPORT_API_URL + '/quality-criteria';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the quality criteria sets of a study
     * @param studyId Id of the study
     */
    getQualityCriteriaList(studyId: String): Observable<QualityCriteria[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<QualityCriteria[]>(url).pipe(
            map((response: any) => response.map((qc: any) => new QualityCriteria(qc))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Retrieves a quality criteria set by id
     * @param qualityCriteriaId Id of the criteria set
     * @param studyId Id of the study
     */
    getQualityCriteriaById(qualityCriteriaId: String, studyId: String): Observable<QualityCriteria> {
        const url = `${this.endpoint}/${qualityCriteriaId}?studyId=${studyId}`;
        return this.httpClient.get<QualityCriteria>(url).pipe(
            map((response: any) => new QualityCriteria(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
