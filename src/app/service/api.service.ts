import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import { environment } from '../environments/environment.ts';

@Injectable({
  providedIn: 'root',
})

/**
 * API Service which hosts the available HTTP Requests to the scripts as functions
 */
export class ApiService {
  /**
   * @private apiUrl which the request are being sent to
   */
  private readonly apiUrl: string;

  /**
   * @param http
   * apiUrl is set to the url provided in the environment.ts file
   */
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  /**
   * @param username Username that will be provided in the form
   * @param password Password that will be provided in the form
   * Login request which returns a List of Strings, which is made of the roles of the logged-in user
   */
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}user/login`;
    return this.http.post(url, {username, password});
  }
}
