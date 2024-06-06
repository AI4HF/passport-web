import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Survey} from "../../../../shared/models/survey.model";

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
      this.surveyService.getSurveyByStudyId(data['study'].id).pipe(takeUntil(this.destroy$))
          .subscribe(surveyList => this.surveyList = surveyList);
    });
  }

  /**
   * Back to experiment questions menu
   */
  back(){
    this.router.navigate([`../experiment-questions`], {relativeTo: this.route});
  }

  /**
   * Save the study and go back to study management
   */
  save(){
    //TODO:
    this.router.navigate([`../../`], {relativeTo: this.route});
  }

}
