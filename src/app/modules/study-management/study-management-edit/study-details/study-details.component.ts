import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../../shared/models/study.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StudyManagementRoutingModule} from "../../study-management-routing.module";

@Component({
  selector: 'app-study-details',
  templateUrl: './study-details.component.html',
  styleUrl: './study-details.component.scss'
})
export class StudyDetailsComponent extends BaseComponent implements OnInit {

  /**
   * The selected study for the component
   */
  selectedStudy: Study;

  /**
   * The form object keeping the study information.
   */
  studyForm: FormGroup;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.selectedStudy = data['study'];
      this.initializeForm();
    });
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
    this.router.navigate([`../population-details`], {relativeTo: this.route});
  }
}
