import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";

/**
 * A controller to edit the details of a Study object
 */
@Component({
  selector: 'app-study-management-edit',
  templateUrl: './study-management-edit.component.html',
  styleUrl: './study-management-edit.component.scss'
})
export class StudyManagementEditComponent extends BaseComponent implements OnInit {

  /**
   * The steps of a study
   */
  studySteps: any[];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {

    this.translateService.get([
      'StudyManagement.Study Details',
      'StudyManagement.Population Details',
      'StudyManagement.Personnel Assignment',
      'StudyManagement.Experiment Questions',
      'StudyManagement.Linked Articles',
      'StudyManagement.Survey Inspection'
    ]).subscribe(translations => {
      this.studySteps = [
        {name: translations['StudyManagement.Study Details'], routerLink: 'study-details', queryParams: this.route.snapshot.queryParams},
        {name: translations['StudyManagement.Population Details'], routerLink: 'population-details', queryParams: this.route.snapshot.queryParams},
        {name: translations['StudyManagement.Personnel Assignment'], routerLink: 'personnel-assignment', queryParams: this.route.snapshot.queryParams},
        {name: translations['StudyManagement.Experiment Questions'], routerLink: 'experiment-questions', queryParams: this.route.snapshot.queryParams},
        {name: translations['StudyManagement.Linked Articles'], routerLink: 'linked-articles', queryParams: this.route.snapshot.queryParams},
        {name: translations['StudyManagement.Survey Inspection'], routerLink: 'survey-inspection', queryParams: this.route.snapshot.queryParams}
      ];
    });
  }

}
