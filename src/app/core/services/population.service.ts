import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Population} from "../../shared/models/population.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the population.
 */
@Injectable({
    providedIn: 'root'
})
export class PopulationService {

    readonly endpoint = environment.PASSPORT_API_URL + '/population';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves the population by using populationId
     * @param id Id of the population
     * @param studyId Id of the study
     * @return {Observable<Population>}
     */
    getPopulationById(id: number, studyId: number): Observable<Population> {
        const url = `${this.endpoint}/${id}?studyId=${studyId}`;
        return this.httpClient.get<Population>(url)
            .pipe(
                map((response: any) =>{
                    return new Population(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    getAllPopulations(): Observable<Population[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Population[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((population: any) => new Population(population));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves populations of a study
     * @param id Id of the study
     * @return {Observable<Population[]>}
     */
    getPopulationByStudyId(id: number): Observable<Population[]> {
        const url = `${this.endpoint}?studyId=${id}`;
        return this.httpClient.get<Population[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((population: any) => new Population(population));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Update the population of a study
     * @param population updated version of the population
     * @param id Id of the study
     * @return {Observable<Population>}
     */
    updatePopulation(population: Population, id:number): Observable<Population> {
        const url = `${this.endpoint}/${population.populationId}?studyId=${id}`;
        return this.httpClient.put<Population>(url, population)
            .pipe(
                map((response: any) =>{
                    return new Population(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create a population for the study
     * @param population population to be created
     * @param id Id of the study
     * @return {Observable<Population>}
     */
    createPopulation(population: Population, id: number): Observable<Population> {
        const url = `${this.endpoint}?studyId=${id}`;
        return this.httpClient.post<Population>(url, population)
            .pipe(
                map((response: any) =>{
                    return new Population(response);
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Delete a population
     * @param id Id of the population
     * @param studyId
     * @return {Observable<any>}
     */
    deletePopulation(id: number, studyId: number): Observable<any>{
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
}