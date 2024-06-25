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
     * Retrieves the population of a study
     * @param id Id of the study
     * @return {Observable<Population>}
     */
    getPopulationByStudyId(id: number): Observable<Population> {
        const url = `${this.endpoint}?studyId=${id}`;
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

    /**
     * Update the population of a study
     * @param population updated version of the population
     * @return {Observable<Population>}
     */
    updatePopulation(population: Population): Observable<Population> {
        const url = `${this.endpoint}/${population.populationId}`;
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
     * @return {Observable<Population>}
     */
    createPopulation(population: Population): Observable<Population> {
        const url = `${this.endpoint}`;
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
}