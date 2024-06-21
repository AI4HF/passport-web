import { Component, OnInit, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Survey } from '../../../shared/models/survey.model';
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base.component';

/**
 * Component for managing survey form
 */
@Component({
    selector: 'app-survey-management-form',
    templateUrl: './survey-management-form.component.html',
    styleUrls: ['./survey-management-form.component.scss']
})
export class SurveyManagementFormComponent extends BaseComponent implements OnInit {
    displayDialog: boolean = true;
    selectedQuestion: Survey = new Survey({});
    newQuestion: boolean = false;
    categories: any[] = [
        { label: 'Testing', value: 'Testing' },
        { label: 'Robustness', value: 'Robustness' },
        { label: 'Explainability', value: 'Explainability' }
    ];
    filteredCategories: any[];
    surveyForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.newQuestion = false;
                const state = this.router.getCurrentNavigation()?.extras?.state;
                if (state && state['survey']) {
                    this.selectedQuestion = new Survey(state['survey']);
                    this.initializeForm();
                } else {
                    this.surveyService.getSurveyById(id).pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: survey => {
                                this.selectedQuestion = survey;
                                this.initializeForm();
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
            } else {
                this.newQuestion = true;
                this.selectedQuestion = new Survey({});
                this.initializeForm();
            }
        });
    }

    /**
     * Initializes the form object for the given survey.
     */
    initializeForm() {
        this.surveyForm = new FormGroup({
            question: new FormControl(this.selectedQuestion.question, Validators.required),
            answer: new FormControl(this.selectedQuestion.answer, Validators.required),
            category: new FormControl(this.selectedQuestion.category, Validators.required)
        });
    }

    /**
     * Save survey details
     */
    saveQuestion() {

        const formValues = this.selectedQuestion;
        formValues.studyId = 1;

        if (this.newQuestion) {
            const newSurvey: Survey = new Survey({ ...formValues });
            this.surveyService.createSurvey(newSurvey)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: survey => {
                        this.selectedQuestion = survey;
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('SurveyManagement.Survey.Survey is created successfully')
                        });
                        this.closeDialog();
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        } else {
            const updatedSurvey: Survey = { surveyId: this.selectedQuestion.surveyId, studyId: 1, ...formValues }; // Setting studyId to 1
            this.surveyService.updateSurvey(updatedSurvey)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: survey => {
                        this.selectedQuestion = survey;
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('SurveyManagement.Survey.Survey is updated successfully')
                        });
                        this.closeDialog();
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
    }

    /**
     * Close the dialog and navigate back
     */
    closeDialog() {
        this.displayDialog = false;
        this.router.navigate(['survey-management']);
    }

    /**
     * Filter category based on user input
     */
    filterCategory(event: AutoCompleteCompleteEvent) {
        const query = event.query;
        this.filteredCategories = this.categories.filter(category => category.label.toLowerCase().includes(query.toLowerCase()));
    }
}
