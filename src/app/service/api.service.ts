import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/**
 * API Service which hosts the available HTTP Requests to the scripts as functions
 */
export class ApiService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }


  /**
   * Login request which returns a List of Strings, which is made of the roles of the logged-in user
   */
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}user/login`;
    return this.http.post(url, {username, password});
  }


}
