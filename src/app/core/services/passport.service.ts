import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Passport} from "../../shared/models/passport.model";
import {StorageUtil} from "./storageUtil.service";
import {PassportDetailsDTO} from "../../shared/models/passportDetails.model";
import {PassportWithDetailSelection} from "../../shared/models/passportWithDetailSelection.model";

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
     * Retrieves all passports by studyId
     * @return {Observable<Passport[]>}
     */
    getPassportListByStudy(studyId: number): Observable<Passport[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.get<Passport[]>(url)
            .pipe(
                map((response: any) => {
                    return response.map((passport: any) => new Passport(passport));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves a single passport by ID
     * @param id Id of the passport
     * @return {Observable<Passport>}
     */
    getPassportById(id: number): Observable<Passport> {
        const url = `${this.endpoint}/${id}`;
        return this.httpClient.get<Passport>(url)
            .pipe(
                map((response: any) => {
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
     * @param studyId
     * @return {Observable<any>}
     */
    deletePassport(id: number, studyId: number): Observable<any>{
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
     * Create a passport
     * @param passportWithDetailSelection passport to be created with selected details
     * @param studyId
     * @return {Observable<Passport>}
     */
    createPassport(passportWithDetailSelection: PassportWithDetailSelection, studyId: number): Observable<Passport>{
        const url = `${this.endpoint}?studyId=${studyId}`;
        passportWithDetailSelection.passport.createdBy = StorageUtil.retrieveUserId();
        passportWithDetailSelection.passport.approvedBy = StorageUtil.retrieveUserId();

        return this.httpClient.post<Passport>(url, passportWithDetailSelection)
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
     * Retrieves detailed information about a passport by ID
     * @param id Id of the passport
     * @param studyId
     * @return {Observable<PassportDetailsDTO>}
     */
    getPassportDetailsById(id: number, studyId: number): Observable<PassportDetailsDTO> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<PassportDetailsDTO>(url)
            .pipe(
                map((response: any) => {
                    return new PassportDetailsDTO(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}
