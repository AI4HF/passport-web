import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Population} from "../../shared/models/population.model";

@Injectable({
    providedIn: 'root'
})
export class PopulationService {

    //TODO: Remove placeholder array after connecting backend
    private populationList = [
        {
            populationId: 1,
            studyId: 1,
            populationUrl: "http://testStudy.com/population1",
            description: "description1",
            characteristics: "characteristics1"
        },
        {
            populationId: 2,
            studyId: 2,
            populationUrl: "http://testStudy.com/population2",
            description: "description2",
            characteristics: "characteristics2"
        }
    ]

    constructor(private http: HttpClient) {
    }

    getPopulationList() {
        return of(this.populationList)
            .pipe(map(response => response.map((item: any) => new Population(item))));
    }

    getPopulationByStudyId(id: number) {
        return of(this.populationList.find(population => population.studyId === id)).pipe(map(
            response => new Population(response)));
    }

    updatePopulation(population: Population){
        this.populationList.forEach(populationElement => {
            if(populationElement.populationId === population.populationId){
                populationElement.studyId = population.studyId;
                populationElement.populationUrl = population.populationUrl;
                populationElement.description = population.description;
                populationElement.characteristics = population.characteristics;
            }
        });
    }

    deletePopulation(id: number){
        this.populationList = this.populationList.filter(population => population.populationId !== id);
    }

    createPopulation(population: Population){
        population.populationId = this.populationList.at(-1).populationId + 1;
        this.populationList.push(population);
    }
}