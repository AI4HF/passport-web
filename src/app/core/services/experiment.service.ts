import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Experiment} from "../../shared/models/experiment.model";
import {environment} from "../../../environments/environment";

/**
 * Service to manage the Experiments.
 */
@Injectable({
    providedIn: 'root'
})
export class ExperimentService {

    readonly endpoint = environment.PASSPORT_API_URL + '/experiment';
    private httpClient: HttpClient;

    constructor(private injector: Injector) {
        this.httpClient = injector.get(HttpClient);
    }

    /**
     * Retrieves all experiments
     * @return {Observable<Experiment[]>}
     */
    getAllExperiments(): Observable<Experiment[]> {
        const url = `${this.endpoint}`;
        return this.httpClient.get<Experiment[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((experiment: any) => new Experiment(experiment));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Retrieves the experiments that assigned to the study
     * @param id Id of the study
     * @return {Observable<Experiment[]>}
     */
    getExperimentListByStudyId(id: String): Observable<Experiment[]> {
        const url = `${this.endpoint}?studyId=${id}`;
        return this.httpClient.get<Experiment[]>(url)
            .pipe(
                map((response: any) =>{
                    return response.map((experiment: any) => new Experiment(experiment));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }

    /**
     * Create and assign experiments to the study
     * @param studyId Id of the study
     * @param experiments Experiments to be created
     * @return {Observable<Personnel[]>}
     */
    createExperiments(studyId: String, experiments: Experiment[]): Observable<Experiment[]> {
        const url = `${this.endpoint}?studyId=${studyId}`;
        return this.httpClient.post<Experiment[]>(url, experiments)
            .pipe(
                map((response: any) =>{
                    return response.map((experiment: any) => new Experiment(experiment));
                }),
                catchError((error) => {
                    console.error(error);
                    throw error;
                })
            );
    }
}