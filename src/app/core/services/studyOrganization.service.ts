import {Injectable, Injector} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Organization} from "../../shared/models/organization.model";
import {Study} from "../../shared/models/study.model";
import {StudyOrganization} from "../../shared/models/studyOrganization.model";

/**
 * Service to manage the studyOrganization.
 */
@Injectable({
    providedIn: 'root'
})
export class StudyOrganizationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/studyOrganization';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves a studyOrganization by studyId and organizationId
     * @param studyId ID of the study
     * @param organizationId ID of the organization
     * @return {Observable<StudyOrganization>}
     */
    getStudyOrganizationByStudyIdAndOrganizationId(studyId: String, organizationId: String): Observable<StudyOrganization> {
        const url = `${this.endpoint}?studyId=${studyId}&organizationId=${organizationId}`;
        return this.httpClient.get<Organization[]>(url)
            .pipe(
                map((response: any) =>{
                    return new StudyOrganization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the organizations that assigned to the study
     * @param id Id of the study
     * @return {Observable<Organization[]>}
     */
    getOrganizationListByStudyId(id: String): Observable<Organization[]> {
        const url = `${this.endpoint}/organizations?studyId=${id}`;
        return this.httpClient.get<Organization[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((organization: any) => new Organization(organization));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the studies that assigned to the organization
     * @param id Id of the organization
     * @return {Observable<Study[]>}
     */
    getStudyListByOrganizationId(id: String): Observable<Study[]> {
        const url = `${this.endpoint}/studies?organizationId=${id}`;
        return this.httpClient.get<Study[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((study: any) => new Study(study));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a study organization
     * @param studyOrganization studyOrganization object that will be created
     * @return {Observable<StudyOrganization>}
     */
    createStudyOrganization(studyOrganization: StudyOrganization): Observable<StudyOrganization> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<StudyOrganization>(url, studyOrganization)
            .pipe(
                map((response: any) =>{
                    return new StudyOrganization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update a study organization
     * @param studyId The ID of the study
     * @param organizationId The ID of the organization
     * @param updatedStudyOrganization updated studyOrganization object
     * @return {Observable<StudyOrganization>}
     */
    updateStudyOrganization(studyId: String, organizationId: String, updatedStudyOrganization: StudyOrganization): Observable<StudyOrganization> {
        const url = `${this.endpoint}?studyId=${studyId}&organizationId=${organizationId}`;
        return this.httpClient.put<StudyOrganization>(url, updatedStudyOrganization)
            .pipe(
                map((response: any) =>{
                    return new StudyOrganization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a study organization
     * @param studyId
     * @param organizationId
     * @return {Observable<any>}
     */
    deleteStudyOrganization(studyId: String, organizationId: String): Observable<any>{
        const url = `${this.endpoint}?studyId=${studyId}&organizationId=${organizationId}`;
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