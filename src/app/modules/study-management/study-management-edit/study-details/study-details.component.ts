import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../../shared/models/study.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StudyManagementRoutingModule} from "../../study-management-routing.module";

/**
 * Shows details of a study
 */
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
    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id !== 'new') {
        this.loadStudy(+id);
      } else {
        this.selectedStudy = new Study({id: 0});
        this.initializeForm();
      }
    });
  }

  /**
   * Load study by ID
   */
  loadStudy(id: number) {
    this.studyService.getStudyById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: study => {
        this.selectedStudy = study;
        this.initializeForm();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

    /**
     * Initializes the form object for the given study.
     */
    initializeForm() {
      this.studyForm = new FormGroup({
        name: new FormControl(this.selectedStudy.name, Validators.required),
        description: new FormControl(this.selectedStudy.description, Validators.required),
        objectives: new FormControl(this.selectedStudy.objectives, Validators.required),
        ethics: new FormControl(this.selectedStudy.ethics, Validators.required)
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
      this.studyService.createStudy(newStudy)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: study => {
              this.selectedStudy = study;
              this.initializeForm();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Sucess'),
                detail: this.translateService.instant('StudyManagement.Study is created successfully')
              });
              this.router.navigate([`../../${this.selectedStudy.id}/population-details`], {relativeTo: this.route});
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            }
          });
    }else{
      const updatedStudy: Study = new Study({id: this.selectedStudy.id, ...this.studyForm.value, owner: this.selectedStudy.owner});
      this.studyService.updateStudy(updatedStudy)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (study: Study) => {
              this.selectedStudy = study;
              this.initializeForm();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Sucess'),
                detail: this.translateService.instant('StudyManagement.Study is updated successfully')
              });
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            },
          });
    }
  }
}
