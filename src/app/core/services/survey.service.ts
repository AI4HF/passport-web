import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Survey} from "../../shared/models/survey.model";

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    //TODO: Remove placeholder array after connecting backend
    private surveyList = [
        {
            surveyId: 1,
            studyId: 1,
            question: "Survey Question 1",
            answer: "Survey Answer 1",
            category: "Survey Category 1"
        },
        {
            surveyId: 2,
            studyId: 1,
            question: "Survey Question 2",
            answer: "Survey Answer 2",
            category: "Survey Category 2"
        },
        {
            surveyId: 3,
            studyId: 2,
            question: "Survey Question 3",
            answer: "Survey Answer 3",
            category: "Survey Category 3"
        },
        {
            surveyId: 5,
            studyId: 2,
            question: "Survey Question 4",
            answer: "Survey Answer 4",
            category: "Survey Category 4"
        },
        {
            surveyId: 6,
            studyId: 2,
            question: "Survey Question 4",
            answer: "Survey Answer 4",
            category: "Survey Category 4"
        },
        {
            surveyId: 7,
            studyId: 2,
            question: "Survey Question 4",
            answer: "Survey Answer 4",
            category: "Survey Category 4"
        },
        {
            surveyId: 8,
            studyId: 2,
            question: "Survey Question 4",
            answer: "Survey Answer 4",
            category: "Survey Category 4"
        }
    ]

    constructor(private http: HttpClient) {
    }

    getSurveyList() {
        return of(this.surveyList)
            .pipe(map(response => response.map((item: any) => new Survey(item))));
    }

    getSurveyById(id: number) {
        return of(this.surveyList.find(survey => survey.surveyId === id)).pipe(map(
            response => new Survey(response)));
    }

    getSurveyByStudyId(id: number) {
        return of(this.surveyList.filter(survey => survey.studyId === id)).pipe(map(
            response => response.map((item: any) => new Survey(item))));
    }


    deleteSurvey(id: number){
        this.surveyList = this.surveyList.filter(survey => survey.surveyId !== id);
    }

    createSurvey(survey: Survey){
        survey.surveyId = this.surveyList.at(-1).surveyId + 1;
        this.surveyList.push(survey);
    }
}