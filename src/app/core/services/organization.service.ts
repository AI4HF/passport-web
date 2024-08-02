import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Organization } from "../../shared/models/organization.model";
import { environment } from "../../../environments/environment";

/**
 * Service to manage the organization.
 */
@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/organization';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all organizations
     * @return {Observable<Organization[]>}
     */
    getAllOrganizations(): Observable<Organization[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Organization[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((organization: any) => new Organization(organization));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the organization by using organizationId
     * @param id Id of the organization
     * @return {Observable<Organization>}
     */
    getOrganizationById(id: number): Observable<Organization> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Organization>(url)
            .pipe(
                map((response: any) => {
                    return new Organization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the organization by using organizationAdminId
     * @param organizationAdminId Id of the organization admin
     * @return {Observable<Organization>}
     */
    getOrganizationByOrganizationAdminId(organizationAdminId: string): Observable<Organization> {
        const url = `${this.endpoint}?organizationAdminId=${organizationAdminId}`;
        return this.httpClient.get<Organization>(url)
            .pipe(
                map((response: any) => {
                    return new Organization(response[0]);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the organization
     * @param organization updated version of the organization
     * @return {Observable<Organization>}
     */
    updateOrganization(organization: Organization): Observable<Organization> {
        const url = `${this.endpoint}/${organization.organizationId}`;
        return this.httpClient.put<Organization>(url, organization)
            .pipe(
                map((response: any) => {
                    return new Organization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete an organization
     * @param id Id of the organization
     * @return {Observable<any>}
     */
    deleteOrganization(id: number): Observable<any> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.delete<any>(url)
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create an organization
     * @param organization organization to be created
     * @return {Observable<Organization>}
     */
    createOrganization(organization: Organization): Observable<Organization> {
        const url = `${this.endpoint}`;
        return this.httpClient.post<Organization>(url, organization)
            .pipe(
                map((response: any) => {
                    return new Organization(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
