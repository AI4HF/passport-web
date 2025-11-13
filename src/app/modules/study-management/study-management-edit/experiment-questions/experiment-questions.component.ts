import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Experiment} from "../../../../shared/models/experiment.model";

/**
 * Shows list of experiments related to the study
 */
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

  /**
   * The studyId for selected study
   */
  studyId: string;

  /**
   * Indicates whether user can edit this page
   */
  viewMode: boolean = false;

  constructor(protected injector: Injector) {
    super(injector);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.viewMode = params['viewMode'] === 'true';
    });

    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.studyId = params.get('id');
      this.fetchExperimentsByStudyId(this.studyId);
    });

    this.initializeForm();
  }

  /**
   * Fetch experiments from experiment service
   * @param studyId ID of the study related to experiments
   */
  fetchExperimentsByStudyId(studyId: string): void {
    this.experimentService.getExperimentListByStudyId(studyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (experimentList: Experiment[]) => {
            this.experimentList = experimentList.map(experiment => new Experiment(experiment));
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
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../personnel-assignment`], {relativeTo: this.route, queryParams: this.route.snapshot.queryParams});
  }

  /**
   * Save created experiments
   */
  save(){
    this.experimentService.createExperiments(this.studyId, this.experimentList)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.fetchExperimentsByStudyId(this.studyId);
            this.translateService.get(['Success', 'StudyManagement.Experiment.Experiments are assigned successfully']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['StudyManagement.Experiment.Experiments are assigned successfully']
              });
            });
          }
        })
  }

  /**
   * Initializes the form object for the given research question.
   */
  initializeForm() {
    this.researchQuestionForm = new FormGroup({
      researchQuestion: new FormControl('', Validators.required)
    });
    if (this.viewMode) {
      this.researchQuestionForm.get('researchQuestion')?.disable({ emitEvent: false });
    }
  }

  /**
   * Add research question into experimentList.
   */
  addResearchQuestion() {
    const researchQuestion = this.researchQuestionForm.value.researchQuestion;
    if(researchQuestion.length > 0){
      this.initializeForm();
      if(!this.experimentList.find(experiment => experiment.researchQuestion === researchQuestion)) {
        this.experimentList.push(new Experiment({experimentId: null, studyId: null, researchQuestion: researchQuestion}));
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
