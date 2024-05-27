import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Study} from "../../shared/models/study.model";

@Injectable({
  providedIn: 'root'
})
export class StudyManagementService {

  //TODO: Remove placeholder array after connecting backend
  private studyList = [
    {
      id: 1,
      name: "study1",
      description: "Study 1",
      objectives: "objectives 1",
      ethics: "ethic 1"
    },
    {
      id: 2,
      name: "study2",
      description: "Study 2",
      objectives: "objectives 2",
      ethics: "ethic 2"
    }
  ]

  constructor(private http: HttpClient) {
  }

  getStudyList() {
    return of(this.studyList)
        .pipe(map(response => response.map((item: any) => new Study(item))));
  }

  getStudyById(id: number) {
    return of(this.studyList.find(study => study.id === id)).pipe(map(
        response => new Study(response)));
  }
}
