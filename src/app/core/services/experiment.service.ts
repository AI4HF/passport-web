import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Experiment} from "../../shared/models/experiment.model";

@Injectable({
    providedIn: 'root'
})
export class ExperimentService {

    //TODO: Remove placeholder array after connecting backend
    private experimentList = [
        {
            experimentId: 1,
            studyId: 1,
            researchQuestion: "Research Question 1"
        },
        {
            experimentId: 2,
            studyId: 1,
            researchQuestion: "Research Question 2"
        },
        {
            experimentId: 3,
            studyId: 2,
            researchQuestion: "Research Question 3"
        },
        {
            experimentId: 4,
            studyId: 2,
            researchQuestion: "Research Question 4"
        }
    ]

    constructor(private http: HttpClient) {
    }

    getExperimentList() {
        return of(this.experimentList)
            .pipe(map(response => response.map((item: any) => new Experiment(item))));
    }

    getExperimentById(id: number) {
        return of(this.experimentList.find(experiment => experiment.experimentId === id)).pipe(map(
            response => new Experiment(response)));
    }

    getExperimentByStudyId(id: number) {
        return of(this.experimentList.filter(experiment => experiment.studyId === id)).pipe(map(
            response => response.map((item: any) => new Experiment(item))));
    }


    deleteExperiment(id: number){
        this.experimentList = this.experimentList.filter(experiment => experiment.experimentId !== id);
    }

    createExperiment(experiment: Experiment){
        experiment.experimentId = this.experimentList.at(-1).experimentId + 1;
        this.experimentList.push(experiment);
    }
}