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

    this.studySteps = [
      {name: this.translateService.instant('StudyManagement.Study Details'), selected: true},
      {name: this.translateService.instant('StudyManagement.Created Populations')},
      {name: this.translateService.instant('StudyManagement.Assigned Personnel')},
      {name: this.translateService.instant('StudyManagement.Created Experiments')},
      {name: this.translateService.instant('StudyManagement.Created Survey Questions')},
    ];
  }

}
