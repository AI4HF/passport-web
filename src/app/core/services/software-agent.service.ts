import { Injectable, Injector } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { SoftwareAgent } from "../../shared/models/softwareAgent.model";

/**
 * Service to manage software agents: the automated integrations that write to the Passport.
 */
@Injectable({
    providedIn: 'root'
})
export class SoftwareAgentService {
    readonly endpoint = environment.PASSPORT_API_URL + '/software-agent';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all software agents
     */
    getSoftwareAgentList(): Observable<SoftwareAgent[]> {
        return this.httpClient.get<SoftwareAgent[]>(this.endpoint).pipe(
            map((response: any) => response.map((agent: any) => new SoftwareAgent(agent))),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Retrieves a software agent by id
     * @param softwareAgentId Id of the software agent
     */
    getSoftwareAgentById(softwareAgentId: String): Observable<SoftwareAgent> {
        const url = `${this.endpoint}/${softwareAgentId}`;
        return this.httpClient.get<SoftwareAgent>(url).pipe(
            map((response: any) => new SoftwareAgent(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Creates a software agent
     * @param softwareAgent Software agent to be created
     */
    createSoftwareAgent(softwareAgent: SoftwareAgent): Observable<SoftwareAgent> {
        return this.httpClient.post<SoftwareAgent>(this.endpoint, softwareAgent).pipe(
            map((response: any) => new SoftwareAgent(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Updates a software agent
     * @param softwareAgent Software agent to be updated
     */
    updateSoftwareAgent(softwareAgent: SoftwareAgent): Observable<SoftwareAgent> {
        const url = `${this.endpoint}/${softwareAgent.softwareAgentId}`;
        return this.httpClient.put<SoftwareAgent>(url, softwareAgent).pipe(
            map((response: any) => new SoftwareAgent(response)),
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    /**
     * Deletes a software agent
     * @param softwareAgentId Id of the software agent
     */
    deleteSoftwareAgent(softwareAgentId: String): Observable<any> {
        const url = `${this.endpoint}/${softwareAgentId}`;
        return this.httpClient.delete<any>(url).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}
