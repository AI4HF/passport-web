import {Injectable, Injector} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Personnel} from "../../shared/models/personnel.model";

/**
 * Service to manage the studyPersonnel.
 */
@Injectable({
    providedIn: 'root'
})
export class StudyPersonnelService {

    readonly endpoint = environment.PASSPORT_API_URL + '/studyPersonnel';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the personnel that assigned to the study
     * @param studyId Id of the study
     * @param organizationId Id of the organization
     * @return {Observable<Personnel[]>}
     */
    getPersonnelListByStudyIdAndOrganizationId(studyId: number, organizationId: number): Observable<Personnel[]> {
        const url = `${this.endpoint}/personnel?studyId=${studyId}&organizationId=${organizationId}`;
        return this.httpClient.get<Personnel[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((personnel: any) => new Personnel(personnel));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Assign personnel to the study
     * @param studyId Id of the study
     * @param organizationId Id of the organization
     * @param personnelList Personnel to be assigned
     * @return {Observable<Personnel[]>}
     */
    createStudyPersonnelAssignment(studyId: number, organizationId: number, personnelList: Personnel[]): Observable<Personnel[]> {
        const url = `${this.endpoint}/personnel?studyId=${studyId}&organizationId=${organizationId}`;
        return this.httpClient.post<Personnel[]>(url, personnelList)
            .pipe(
                map((response: any) =>{
                    return response.map((personnel: any) => new Personnel(personnel));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }


}