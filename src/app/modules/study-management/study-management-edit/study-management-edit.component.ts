import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../shared/models/study.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
   * The selected study for the component
   */
  selectedStudy: Study;

  /**
   * The steps of a study
   */
  studySteps: any[];

  /**
   * The form object keeping the study information.
   */
  studyForm: FormGroup;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.selectedStudy = data['study'];
      this.initializeForm();
    });

    this.studySteps = [
      {name: 'Study Details'},
      {name: 'Created Populations'},
      {name: 'Assigned Personnel'},
      {name: 'Created Experiments'},
      {name: 'Created Survey Questions'},
    ];
  }

  /**
   * Initializes the form object for the given study.
   */
  initializeForm() {

    const name = this.selectedStudy.name ?? '';
    const description = this.selectedStudy.description ?? '';
    const objectives = this.selectedStudy.objectives ?? '';
    const ethics = this.selectedStudy.ethics ?? '';

    this.studyForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      description: new FormControl(description, Validators.required),
      objectives: new FormControl(objectives, Validators.required),
      ethics: new FormControl(ethics, Validators.required)
    });
  }
}
