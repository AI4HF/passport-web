import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {ModelDeployment} from "../../shared/models/modelDeployment.model";
import {environment} from "../../../environments/environment";
import {StorageUtil} from "./storageUtil.service";

/**
 * Service to manage the model deployment.
 */
@Injectable({
  providedIn: 'root'
})
export class ModelDeploymentService {

  readonly endpoint = environment.PASSPORT_API_URL + '/modelDeployment';
  private httpClient: HttpClient;

  constructor(private injector: Injector) {
    this.httpClient = injector.get(HttpClient);
  }

  /**
   * Retrieves all model deployments by studyId
   * @param studyId The ID of the study
   * @return {Observable<ModelDeployment[]>}
   */
  getModelDeploymentListByStudyId(studyId: String): Observable<ModelDeployment[]> {
    const url = `${this.endpoint}?studyId=${studyId}`;
    return this.httpClient.get<ModelDeployment[]>(url)
        .pipe(
            map((response: any) =>{
              return response.map((modelDeployment: any) => new ModelDeployment(modelDeployment));
            }),
            catchError((error) => {
              console.error(error);
              throw error;
            })
        );
  }


    /**
     * Retrieves the modelDeployment by using environmentId
     * @param id Id of the deployment environment
     * @param studyId
     * @return {Observable<ModelDeployment>}
     */
    getModelDeploymentByEnvironmentId(id: String, studyId: String): Observable<ModelDeployment> {
        const url = `${this.endpoint}?environmentId=${id}&studyId=${studyId}`;
        return this.httpClient.get<ModelDeployment>(url)
            .pipe(
                map((response: any) =>{
                    if(response.length === 0){
                        return new ModelDeployment({ deploymentId: null });
                    }else{
                        return new ModelDeployment(response[0]);
                    }
                }),
                catchError((error) => {
                    if (error.status === 404) {
                        return of(new ModelDeployment({ deploymentId: 0 }));
                    } else {
                        console.error(error);
                        throw error;
                    }
                })
            );
    }


  /**
   * Retrieves the modelDeployment by using modelDeploymentId
   * @param id Id of the modelDeployment
   * @param studyId
   * @return {Observable<ModelDeployment>}
   */
  getModelDeploymentById(id: String, studyId: String): Observable<ModelDeployment> {
    const url = `${this.endpoint}/${id}?studyId=${studyId}`;
    return this.httpClient.get<ModelDeployment>(url)
        .pipe(
            map((response: any) =>{
              return new ModelDeployment(response);
            }),
            catchError((error) => {
              console.error(error);
              throw error;
            })
        );
  }

  /**
   * Update the modelDeployment
   * @param modelDeployment updated version of the modelDeployment
   * @param studyId
   * @return {Observable<ModelDeployment>}
   */
  updateModelDeployment(modelDeployment: ModelDeployment, studyId: String): Observable<ModelDeployment>{
    const url = `${this.endpoint}/${modelDeployment.deploymentId}?studyId=${studyId}`;
      modelDeployment.lastUpdatedBy = StorageUtil.retrieveUserId();
    return this.httpClient.put<ModelDeployment>(url, modelDeployment)
        .pipe(
            map((response: any) =>{
              return new ModelDeployment(response);
            }),
            catchError((error) => {
              console.error(error);
              throw error;
            })
        );
  }

  /**
   * Delete a modelDeployment
   * @param id Id of the modelDeployment
   * @param studyId
   * @return {Observable<any>}
   */
  deleteModelDeployment(id: String, studyId: String): Observable<any>{
    const url = `${this.endpoint}/${id}?studyId=${studyId}`;
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
   * Create a modelDeployment
   * @param modelDeployment modelDeployment to be created
   * @param studyId
   * @return {Observable<ModelDeployment>}
   */
  createModelDeployment(modelDeployment: ModelDeployment, studyId: String): Observable<ModelDeployment>{
    const url = `${this.endpoint}?studyId=${studyId}`;
      modelDeployment.createdBy = StorageUtil.retrieveUserId();
      modelDeployment.lastUpdatedBy = StorageUtil.retrieveUserId();
    return this.httpClient.post<ModelDeployment>(url, modelDeployment)
        .pipe(
            map((response: any) =>{
              return new ModelDeployment(response);
            }),
            catchError((error) => {
              console.error(error);
              throw error;
            })
        );
  }

    /**
     * Validates if a model deployment deletion is safe regarding cascading permissions.
     * @param deploymentId Id of the deployment
     * @param studyId ID of the study
     * @return {Observable<any>}
     */
    validateModelDeploymentDeletion(deploymentId: String, studyId: String): Observable<any> {
        const url = `${this.endpoint}/${deploymentId}/validate-deletion?studyId=${studyId}`;
        return this.httpClient.get(url, { responseType: 'text' })
            .pipe(
                map((response: any) => {
                    return response;
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }
}
