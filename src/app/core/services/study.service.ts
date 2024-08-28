import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Study} from "../../shared/models/study.model";
import {environment} from "../../../environments/environment";
import {StorageUtil} from "./storageUtil.service";

/**
 * Service to manage the study.
 */
@Injectable({
  providedIn: 'root'
})
export class StudyService {

  readonly endpoint = environment.PASSPORT_API_URL + '/study';
  private httpClient: HttpClient;

  constructor(private injector: Injector) {
      this.httpClient = injector.get(HttpClient);
  }
    /**
     * Retrieves all studies
     * @return {Observable<Study[]>}
     */
  getStudyList(): Observable<Study[]> {
    const url = `${this.endpoint}`;
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
     * Retrieves all studies by owner
     * @return {Observable<Study[]>}
     */
    getStudyListByOwner(owner: string): Observable<Study[]> {
        const url = `${this.endpoint}?owner=${owner}`;
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
     * Retrieves the study by using studyId
     * @param id Id of the study
     * @return {Observable<Study>}
     */
  getStudyById(id: number): Observable<Study> {
    const url = `${this.endpoint}/${id}`;
    return this.httpClient.get<Study>(url)
      .pipe(
          map((response: any) =>{
            return new Study(response);
          }),
          catchError((error) => {
            console.error(error);
            throw error;
          })
      );
  }

    /**
     * Update the study
     * @param study updated version of the study
     * @return {Observable<Study>}
     */
  updateStudy(study: Study): Observable<Study>{
    const url = `${this.endpoint}/${study.id}`;
    return this.httpClient.put<Study>(url, study)
      .pipe(
          map((response: any) =>{
              return new Study(response);
          }),
          catchError((error) => {
            console.error(error);
            throw error;
          })
      );
  }

    /**
     * Delete a study
     * @param id Id of the study
     * @return {Observable<any>}
     */
  deleteStudy(id: number): Observable<any>{
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
     * Create a study
     * @param study study to be created
     * @return {Observable<Study>}
     */
  createStudy(study: Study): Observable<Study>{
    const url = `${this.endpoint}`;
    study.owner = StorageUtil.retrieveUserId();
    return this.httpClient.post<Study>(url, study)
        .pipe(
            map((response: any) =>{
              return new Study(response);
            }),
            catchError((error) => {
              console.error(error);
              throw error;
            })
        );
  }
}
