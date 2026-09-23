import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { QualityAssessment } from "../../shared/models/qualityAssessment.model";

/**
 * Service to read quality assessment runs.
 */
@Injectable({
    providedIn: 'root'
})
export class QualityAssessmentService {
    readonly endpoint = environment.PASSPORT_API_URL + '/quality-assessment';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the assessment runs of a study
     * @param studyId Id of the study
     */
    getQualityAssessmentList(studyId: String): Observable<QualityAssessment[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<QualityAssessment[]>(url).pipe(
            map((response: any) => response.map((qa: any) => new QualityAssessment(qa))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Retrieves the assessment runs of one dataset, i.e. its quality history
     * @param datasetId Id of the dataset
     * @param studyId Id of the study
     */
    getQualityAssessmentsByDatasetId(datasetId: String, studyId: String): Observable<QualityAssessment[]> {
        const url = `${this.endpoint}?datasetId=${datasetId}&studyId=${studyId}`;
        return this.httpClient.get<QualityAssessment[]>(url).pipe(
            map((response: any) => response.map((qa: any) => new QualityAssessment(qa))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
