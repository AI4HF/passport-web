import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {ModelDeployment} from "../../shared/models/modelDeployment.model";
import {environment} from "../../../environments/environment";

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
   * Retrieves all model deployments
   * @return {Observable<ModelDeployment[]>}
   */
  getModelDeploymentList(): Observable<ModelDeployment[]> {
    const url = `${this.endpoint}`;
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
   * Retrieves the modelDeployment by using modelDeploymentId
   * @param id Id of the modelDeployment
   * @return {Observable<ModelDeployment>}
   */
  getModelDeploymentById(id: number): Observable<ModelDeployment> {
    const url = `${this.endpoint}/${id}`;
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
   * @return {Observable<ModelDeployment>}
   */
  updateModelDeployment(modelDeployment: ModelDeployment): Observable<ModelDeployment>{
    const url = `${this.endpoint}/${modelDeployment.deploymentId}`;
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
   * @return {Observable<any>}
   */
  deleteModelDeployment(id: number): Observable<any>{
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
   * Create a modelDeployment
   * @param modelDeployment modelDeployment to be created
   * @return {Observable<ModelDeployment>}
   */
  createModelDeployment(modelDeployment: ModelDeployment): Observable<ModelDeployment>{
    const url = `${this.endpoint}/`;
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
}
