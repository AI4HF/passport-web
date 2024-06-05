import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Experiment} from "../../../../shared/models/experiment.model";

@Component({
  selector: 'app-experiment-questions',
  templateUrl: './experiment-questions.component.html',
  styleUrl: './experiment-questions.component.scss'
})
export class ExperimentQuestionsComponent extends BaseComponent implements OnInit{


  /**
   * The form object keeping the research question.
   */
  researchQuestionForm: FormGroup;

  /**
   * The Experiment List for selected Study
   */
  experimentList: Experiment[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }


  ngOnInit(): void {
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.experimentService.getExperimentByStudyId(data['study'].id).pipe(takeUntil(this.destroy$))
          .subscribe(experimentList => {
        this.experimentList = experimentList.map(experiment => new Experiment(experiment));
      });
    });
    this.initializeForm();
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../personnel-assignment`], {relativeTo: this.route});
  }

  /**
   * Next to experiment details menu
   */
  next(){
    //TODO:
    this.router.navigate([`../experiment-questions`], {relativeTo: this.route});
  }

  /**
   * Initializes the form object for the given research question.
   */
  initializeForm() {
    this.researchQuestionForm = new FormGroup({
      researchQuestion: new FormControl('', Validators.required)
    });

  }

  /**
   * Add research question into experimentList.
   */
  addResearchQuestion() {
    const researchQuestion = this.researchQuestionForm.value.researchQuestion;
    if(researchQuestion.length > 0){
      this.initializeForm();
      if(!this.experimentList.find(experiment => experiment.researchQuestion === researchQuestion)) {
        this.experimentList.push(new Experiment({experimentId: 0, studyId: 0, researchQuestion: researchQuestion}));
      }
    }
  }

  /**
   * Delete research question from experimentList.
   */
  deleteQuestion(question: string) {
    this.experimentList = this.experimentList.filter(experiment => experiment.researchQuestion !== question);
  }
}
