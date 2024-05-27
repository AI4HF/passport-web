import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../shared/models/study.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StudyManagementRoutingModule} from "../study-management-routing.module";

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
      {name: this.translateService.instant('StudyManagement.Study Details'), selected: true},
      {name: this.translateService.instant('StudyManagement.Created Populations')},
      {name: this.translateService.instant('StudyManagement.Assigned Personnel')},
      {name: this.translateService.instant('StudyManagement.Created Experiments')},
      {name: this.translateService.instant('StudyManagement.Created Survey Questions')},
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

  /**
   * Navigate to a step from left menu
   */
  navigateStep() {
    //TODO:
  }

  /**
   * Back to study management menu
   */
  back(){
    this.router.navigate([`/${StudyManagementRoutingModule.route}`]);
  }

  /**
   * Save study details
   */
  save(){
    if(this.selectedStudy.id === 0){
      const newStudy: Study = new Study({ ...this.studyForm.value});
      this.studyManagementService.createStudy(newStudy);
    }else{
      const updatedStudy: Study = new Study({id: this.selectedStudy.id, ...this.studyForm.value});
      this.studyManagementService.updateStudy(updatedStudy);
    }
    this.back();
  }
}
