import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {DeploymentEnvironment} from "../../shared/models/deploymentEnvironment.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the deployment environment.
 */
@Injectable({
    providedIn: 'root'
})
export class DeploymentEnvironmentService {

    readonly endpoint = environment.PASSPORT_API_URL + '/deploymentEnvironment';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }


    /**
     * Retrieves the deploymentEnvironment by using deploymentEnvironmentId
     * @param id Id of the deploymentEnvironment
     * @param studyId
     * @return {Observable<DeploymentEnvironment>}
     */
    getDeploymentEnvironmentById(id: String, studyId: String): Observable<DeploymentEnvironment> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<DeploymentEnvironment>(url)
            .pipe(
                map((response: any) =>{
                    return new DeploymentEnvironment(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the deploymentEnvironment
     * @param deploymentEnvironment updated version of the deploymentEnvironment
     * @param studyId
     * @return {Observable<DeploymentEnvironment>}
     */
    updateDeploymentEnvironment(deploymentEnvironment: DeploymentEnvironment, studyId: String): Observable<DeploymentEnvironment>{
        const url = `${this.endpoint}/${deploymentEnvironment.environmentId}?studyId=${studyId}`;
        return this.httpClient.put<DeploymentEnvironment>(url, deploymentEnvironment)
            .pipe(
                map((response: any) =>{
                    return new DeploymentEnvironment(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a deploymentEnvironment
     * @param id Id of the deploymentEnvironment
     * @return {Observable<any>}
     */
    deleteDeploymentEnvironment(id: String): Observable<any>{
        const url = `${this.endpoint}/${id}`;
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

    /**
     * Create a deploymentEnvironment
     * @param deploymentEnvironment deploymentEnvironment to be created
     * @param studyId
     * @return {Observable<DeploymentEnvironment>}
     */
    createDeploymentEnvironment(deploymentEnvironment: DeploymentEnvironment, studyId: String): Observable<DeploymentEnvironment>{
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<DeploymentEnvironment>(url, deploymentEnvironment)
            .pipe(
                map((response: any) =>{
                    return new DeploymentEnvironment(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
