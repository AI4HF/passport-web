import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //Local port to send the requests
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }


  //Login request call which returns a List of Strings, which made of the roles of the logged in user
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}user/login`;
    return this.http.post(url, {username, password});
  }


}
