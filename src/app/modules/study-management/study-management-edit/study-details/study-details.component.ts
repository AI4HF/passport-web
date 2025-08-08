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

  /**
   * Indicates whether user can edit this page
   */
  viewMode: boolean = false;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.viewMode = params['viewMode'] === 'true';
    });

    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id !== 'new') {
        this.loadStudy(id);
      } else {
        this.selectedStudy = new Study({id: null});
        this.initializeForm();
      }
    });
  }

  /**
   * Load study by ID
   */
  loadStudy(id: string) {
    this.studyService.getStudyById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: study => {
        this.selectedStudy = study;
        this.initializeForm();
      },
      error: error => {
        this.translateService.get('Error').subscribe(translation => {
          this.messageService.add({
            severity: 'error',
            summary: translation,
            detail: error.message
          });
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
    if(this.selectedStudy.id === null){
      const newStudy: Study = new Study({ ...this.studyForm.value});
      this.studyService.createStudy(newStudy)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: study => {
              this.selectedStudy = study;
              this.initializeForm();
              this.translateService.get(['Success', 'StudyManagement.Study is created successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['StudyManagement.Study is created successfully']
                });
              });
              this.router.navigate([`../../${this.selectedStudy.id}/population-details`], {relativeTo: this.route});
            },
            error: (error: any) => {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
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
              this.translateService.get(['Success', 'StudyManagement.Study is updated successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['StudyManagement.Study is updated successfully']
                });
              });
            },
            error: (error: any) => {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
              });
            },
          });
    }
  }
}
