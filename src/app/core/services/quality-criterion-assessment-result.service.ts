import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { QualityCriterionAssessmentResult } from "../../shared/models/qualityCriterionAssessmentResult.model";

/**
 * Service to read the per-criterion results of an assessment run.
 */
@Injectable({
    providedIn: 'root'
})
export class QualityCriterionAssessmentResultService {
    readonly endpoint = environment.PASSPORT_API_URL + '/quality-criterion-assessment-result';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the results of an assessment run
     * @param qualityAssessmentId Id of the assessment run
     * @param studyId Id of the study
     */
    getResultsByAssessmentId(qualityAssessmentId: String, studyId: String): Observable<QualityCriterionAssessmentResult[]> {
        const url = `${this.endpoint}?qualityAssessmentId=${qualityAssessmentId}&studyId=${studyId}`;
        return this.httpClient.get<QualityCriterionAssessmentResult[]>(url).pipe(
            map((response: any) => response.map((r: any) => new QualityCriterionAssessmentResult(r))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
