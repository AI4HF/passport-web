import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {API_URL} from "../../environments/environment";

/**
 * API Service which hosts the available HTTP Requests to the scripts as functions
 */
@Injectable({
  providedIn: 'root',
})

export class ApiService {
  /**
   * @private apiUrl which the request are being sent to
   */
  private readonly apiUrl: string;

  /**
   * apiUrl is set to the url provided in the environment.ts file
   * @param http
   */
  constructor(private http: HttpClient) {
    this.apiUrl = API_URL;
  }

  /**
   *  AUTHORIZATION API
   */

  /**
   * Login request which returns a Token String, which can be used for further authentication and to obtain
   * @param username Username that will be provided in the form
   * @param password Password that will be provided in the form
   */
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/user/login`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, { username, password }, { headers, responseType: 'text' });
  }

  /**
   *  AUTHORIZATION API END
   */

  /**
   *  STUDY MANAGEMENT API
   */

  /**
   * Request which reads uses the token in the local storage to gain access to all of the studies.
   */
  getAllStudies(): Observable<any> {
    const url = `${this.apiUrl}/study/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(url, { headers });
  }

  /**
   * INCOMPLETE - TEMPLATE API
   */
  getStudyById(id: number): Observable<any> {
    const url = `${this.apiUrl}/study/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  createStudy(study: any): Observable<any> {
    const url = `${this.apiUrl}/study/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, study, { headers });
  }

  updateStudy(id: number, updatedStudy: any): Observable<any> {
    const url = `${this.apiUrl}/study/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, updatedStudy, { headers });
  }

  /**
   *  INCOMPLETE - TEMPLATE API
   */

  /**
   * Deletion request which gains access to the task with its Authorization header token, and searches the unique id of the study to find and delete it.
   * @param id Unique id of the to-be-deleted study.
   */
  deleteStudy(id: number): Observable<any> {
    const url = `${this.apiUrl}/study/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(url, { headers });
  }

  /**
   *  STUDY MANAGEMENT API END
   */

}
