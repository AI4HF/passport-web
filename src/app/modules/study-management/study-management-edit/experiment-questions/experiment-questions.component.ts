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

  constructor(protected injector: Injector) {
    super(injector);
  }


  ngOnInit(): void {
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
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          }
        });
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../personnel-assignment`], {relativeTo: this.route});
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
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Experiment.Experiments are assigned successfully')
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
