import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {API_URL} from "../environments/environment";

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
   * Login request which returns a Token String, which can be used for further authentication and to obtain
   * @param username Username that will be provided in the form
   * @param password Password that will be provided in the form
   */
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/user/login`;
    return this.http.post(url, {username, password});
  }
}
