import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Study} from "../../shared/models/study.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  readonly endpoint = environment.PASSPORT_API_URL + '/study';
  private httpClient: HttpClient;

  constructor(private injector: Injector) {
      this.httpClient = injector.get(HttpClient);
  }

  getStudyList(): Observable<Study[]> {
    const url = `${this.endpoint}/`;
    return this.httpClient.get<Study[]>(url)
      .pipe(
          map((response: any) =>{
            return response.map((study: any) => new Study(study));
          }),
          catchError((error) => {
            console.log(error);
            throw error;
          })
      );
  }

  getStudyById(id: number): Observable<Study> {
    const url = `${this.endpoint}/${id}`;
    return this.httpClient.get<Study>(url)
      .pipe(
          map((response: any) =>{
            return new Study(response);
          }),
          catchError((error) => {
            console.log(error);
            throw error;
          })
      );
  }
  
  updateStudy(study: Study): Observable<Study>{
    const url = `${this.endpoint}/${study.id}`;
    return this.httpClient.put<Study>(url, study)
      .pipe(
          map((response: any) =>{
              return new Study(response);
          }),
          catchError((error) => {
            console.log(error);
            throw error;
          })
      );
  }

  deleteStudy(id: number){
      const url = `${this.endpoint}/${id}`;
      return this.httpClient.delete<any>(url)
          .pipe(
              map((response: any) =>{
                  return response;
              }),
              catchError((error) => {
                  console.log(error);
                  throw error;
              })
          );
  }

  createStudy(study: Study): Observable<Study>{
    const url = `${this.endpoint}/`;
    return this.httpClient.post<Study>(url, study)
        .pipe(
            map((response: any) =>{
              return new Study(response);
            }),
            catchError((error) => {
              console.log(error);
              throw error;
            })
        );
  }
}
