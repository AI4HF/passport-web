import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Personnel} from "../../shared/models/personnel.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage personnel.
 */
@Injectable({
    providedIn: 'root'
})
export class PersonnelService {

    readonly endpoint = environment.PASSPORT_API_URL + '/personnel';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all personnel
     * @return {Observable<Personnel[]>}
     */
    getAllPersonnel(): Observable<Personnel[]> {
        const url = `${this.endpoint}`;
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
     * Retrieves personnel of an organization
     * @param organizationId Id of the organization
     * @return {Observable<Personnel[]>}
     */
    getPersonnelByOrganizationId(organizationId: number): Observable<Personnel[]> {
        const url = `${this.endpoint}?organizationId=${organizationId}`;
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
     * Retrieve a personnel by personId
     * @param personId Id of the person
     * @return {Observable<Personnel>}
     */
    getPersonnelByPersonId(personId: number): Observable<Personnel> {
        const url = `${this.endpoint}/${personId}`;
        return this.httpClient.get<Personnel>(url)
            .pipe(
                map((response: any) =>{
                    return new Personnel(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a personnel for the organization
     * @param personnel personnel to be created
     * @return {Observable<Personnel>}
     */
    createPersonnelByPersonId(personnel: Personnel): Observable<Personnel> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<Personnel>(url, personnel)
            .pipe(
                map((response: any) =>{
                    return new Personnel(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the personnel of the organization
     * @param personnel updated version of the personnel
     * @return {Observable<Personnel>}
     */
    updatePersonnel(personnel: Personnel): Observable<Personnel> {
        const url = `${this.endpoint}/${personnel.personId}`;
        return this.httpClient.put<Personnel>(url, personnel)
            .pipe(
                map((response: any) =>{
                    return new Personnel(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the personnel of the organization
     * @param personId Id of the person
     * @return {Observable<any>}
     */
    deletePersonnel(personId: number): Observable<any> {
        const url = `${this.endpoint}/${personId}`;
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