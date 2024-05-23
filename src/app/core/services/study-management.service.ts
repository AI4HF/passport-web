import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {Study} from "../../shared/models/study.model";

@Injectable({
  providedIn: 'root'
})
export class StudyManagementService {

  constructor(private http: HttpClient) {
  }

  getStudyList() {
    //TODO: Remove placeholder array after connecting backend
    const studyList = [
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
    return of(studyList)
        .pipe(map(response => response.map((item: any) => new Study(item))));
  }
}
