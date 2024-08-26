import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Passport} from "../../shared/models/passport.model";
import {StorageUtil} from "./storageUtil.service";

/**
 * Service to manage the passport.
 */
@Injectable({
    providedIn: 'root'
})
export class PassportService {

    readonly endpoint = environment.PASSPORT_API_URL + '/passport';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }


    /**
     * Retrieves all passports
     * @return {Observable<Passport[]>}
     */
    getPassportListByStudy(studyId: number): Observable<Passport[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Passport[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((passport: any) => new Passport(passport));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }


    /**
     * Retrieves the passport by using passportId
     * @param id Id of the passport
     * @return {Observable<Passport>}
     */
    getPassportById(id: number): Observable<Passport> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Passport>(url)
            .pipe(
                map((response: any) =>{
                    return new Passport(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }


    /**
     * Delete a passport
     * @param id Id of the passport
     * @return {Observable<any>}
     */
    deletePassport(id: number): Observable<any>{
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
     * Create a passport
     * @param passport passport to be created
     * @return {Observable<Passport>}
     */
    createPassport(passport: Passport): Observable<Passport>{
        const url = `${this.endpoint}`;
        passport.createdBy = StorageUtil.retrieveUserId();
        passport.approvedBy = StorageUtil.retrieveUserId();

        return this.httpClient.post<Passport>(url, passport)
            .pipe(
                map((response: any) =>{
                    return new Passport(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
