import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Organization } from '../../shared/models/organization.model';
import {Personnel} from "../../shared/models/personnel.model";

@Injectable({
    providedIn: 'root'
})
export class OrganizationManagementService {
    private apiUrl = 'http://localhost:8080/organization';
    private apiUrlPersonnel = 'http://localhost:8080/personnel';
    constructor(private http: HttpClient) { }

    private getHeaders(token: string): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    /**
     * Organization Requests
     */
    getAllOrganizations(page: number, token: string): Observable<Organization[]> {
        const headers = this.getHeaders(token);
        const params = new HttpParams().set('page', page.toString());
        return this.http.get<Organization[]>(`${this.apiUrl}/${page}`, {headers});
    }

    createOrganization(organization: Organization, token: string): Observable<Organization> {
        const headers = this.getHeaders(token);
        return this.http.post<Organization>(`${this.apiUrl}/`, organization, { headers });
    }

    updateOrganization(organizationId: number, organization: Organization, token: string): Observable<Organization> {
        const headers = this.getHeaders(token);
        return this.http.put<Organization>(`${this.apiUrl}/${organizationId}`, organization, { headers });
    }

    deleteOrganization(organizationId: number, token: string): Observable<void> {
        const headers = this.getHeaders(token);
        return this.http.delete<void>(`${this.apiUrl}/${organizationId}`, { headers });
    }

    /**
     * Personnel Requests
     */

    getAllPersonnel(organizationId: number, page: number, token: string): Observable<Personnel[]> {
        const headers = this.getHeaders(token);
        return this.http.get<Personnel[]>(`${this.apiUrlPersonnel}/personnel/${page}`, { headers });
    }

    getAllPersonnelOfOrganization(organizationId: number, page: number, pageSize: number, token: string): Observable<{ personnel: Personnel[], totalCount: number }> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Personnel[]>(`${this.apiUrlPersonnel}/?organizationId=${organizationId}&page=${page}&pageSize=${pageSize}`, { headers, observe: 'response' })
            .pipe(
                map((response: HttpResponse<Personnel[]>) => {
                    const totalCount = parseInt(response.headers.get('X-Total-Count'));
                    return { personnel: response.body, totalCount };
                })
            );
    }

    createPersonnel(personnel: Personnel, token: string): Observable<Personnel> {
        const headers = this.getHeaders(token);
        return this.http.post<Personnel>(`${this.apiUrlPersonnel}/`, personnel, { headers });
    }

    updatePersonnel(personnelId: number, personnel: Personnel, token: string): Observable<Personnel> {
        const headers = this.getHeaders(token);
        return this.http.put<Personnel>(`${this.apiUrlPersonnel}/${personnelId}`, personnel, { headers });
    }

    deletePersonnel(personnelId: number, token: string): Observable<void> {
        const headers = this.getHeaders(token);
        return this.http.delete<void>(`${this.apiUrlPersonnel}/${personnelId}`, { headers });
    }
}
