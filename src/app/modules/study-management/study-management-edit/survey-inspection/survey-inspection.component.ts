import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Survey} from "../../../../shared/models/survey.model";

/**
 * Shows list of surveys related to the study
 */
@Component({
  selector: 'app-survey-inspection',
  templateUrl: './survey-inspection.component.html',
  styleUrl: './survey-inspection.component.scss'
})
export class SurveyInspectionComponent extends BaseComponent implements OnInit {

  /**
   * The survey list for inspection
   */
  surveyList: Survey[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.surveyService.getSurveysByStudyId(data['study'].id).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (surveyList: Survey[]) => this.surveyList = surveyList.map(survey => new Survey(survey)),
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            }
          });
    });
  }

  /**
   * Back to experiment questions menu
   */
  back(){
    this.router.navigate([`../experiment-questions`], {relativeTo: this.route});
  }

  /**
   * Finish study management steps and go back to study management
   */
  finish(){
    this.router.navigate([`../../`], {relativeTo: this.route});
  }

}
