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
      this.surveyService.getSurveysByStudyId(params.get('id')).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (surveyList: Survey[]) => this.surveyList = surveyList.map(survey => new Survey(survey)),
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
    });
  }

  /**
   * Back to experiment questions menu
   */
  back(){
    this.router.navigate([`../experiment-questions`], {relativeTo: this.route, queryParams: this.route.snapshot.queryParams});
  }

  /**
   * Finish study management steps and go back to study management
   */
  finish(){
    this.router.navigate([`../../`], {relativeTo: this.route});
  }

}
