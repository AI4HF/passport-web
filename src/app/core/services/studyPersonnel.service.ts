import {Injectable, Injector} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Personnel} from "../../shared/models/personnel.model";
import {Study} from "../../shared/models/study.model";
import {StudyPersonnel} from "../../shared/models/studyPersonnel.model";
import {PersonnelRoleMap} from "../../shared/models/personnelRoleMap";

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
    getPersonnelListByStudyIdAndOrganizationId(studyId: string, organizationId: string): Observable<Personnel[]> {
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
     * Retrieves the studies that assigned to the personnel
     * @return {Observable<Study[]>}
     */
    getStudiesByPersonnelId(): Observable<Study[]> {
        const url = `${this.endpoint}/studies`;
        return this.httpClient.get<Personnel[]>(url)
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
     * Assign personnel to the study with their roles
     * @param studyId Id of the study
     * @param organizationId Id of the organization
     * @param personnelRoleMap Map of personnel to roles
     * @return {Observable<any>}
     */
    createStudyPersonnelEntries(studyId: string, organizationId: string, personnelRoleMap: PersonnelRoleMap): Observable<any> {
        return this.httpClient.post(`${this.endpoint}/personnel?studyId=${studyId}&organizationId=${organizationId}`, personnelRoleMap.personnelRoles);
    }


    /**
     * Retrieves study personnel connections for the current user
     * and transforms the role field into a list of roles.
     */
    getStudyPersonnelEntries(personId: string): Observable<StudyPersonnel[]> {
        const url = `${this.endpoint}?personId=${personId}`;
        return this.httpClient.get<StudyPersonnel[]>(url)
            .pipe(
                map((response: any) => response.map((entry: any) => {
                    const studyPersonnel = new StudyPersonnel({});
                    studyPersonnel.setRolesFromstring(entry.role);
                    studyPersonnel.id.personnelId = entry.id.personnelId;
                    studyPersonnel.id.studyId = entry.id.studyId;
                    return studyPersonnel;
                })),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
    /**
     * Retrieves the personnel-role relations assigned to a study.
     * @param studyId Id of the study
     * @return {Observable<StudyPersonnel[]>}
     */
    getStudyPersonnelByStudyId(studyId: string): Observable<StudyPersonnel[]> {
        const url = `${this.endpoint}/studyPersonnel?studyId=${studyId}`;
        return this.httpClient.get<StudyPersonnel[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((relation: any) => new StudyPersonnel(relation));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the personnel-role relations assigned to a study for a specific organization.
     * @param studyId Id of the study
     * @param organizationId Id of the organization
     * @return {Observable<Map<string, string[]>>} A map of personnel IDs to their roles
     */
    getPersonnelRolesByStudyAndOrganization(studyId: string, organizationId: string): Observable<Map<string, string[]>> {
        const url = `${this.endpoint}/roles?studyId=${studyId}&organizationId=${organizationId}`;
        return this.httpClient.get<{ [key: string]: string[] }>(url).pipe(
            map((response: { [key: string]: string[] }) => {
                const personnelRoleMap = new Map<string, string[]>();

                // Iterate over the response object keys
                Object.keys(response).forEach(personId => {
                    personnelRoleMap.set(personId, response[personId] || []);
                });

                return personnelRoleMap;
            }),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }





}
