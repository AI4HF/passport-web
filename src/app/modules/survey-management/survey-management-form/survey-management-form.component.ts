import { Component, OnInit, Injector, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Survey } from '../../../shared/models/survey.model';
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base.component';
import { Study } from '../../../shared/models/study.model';

/**
 * Component for creating or updating survey questions.
 */
@Component({
    selector: 'app-survey-management-form',
    templateUrl: './survey-management-form.component.html',
    styleUrls: ['./survey-management-form.component.scss']
})
export class SurveyManagementFormComponent extends BaseComponent implements OnInit, OnChanges {
    /** Determines if the form is displayed */
    @Input() displayForm: boolean;
    /** The ID of the survey to be edited */
    @Input() surveyId: number;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The selected survey question */
    selectedQuestion: Survey = new Survey({});
    /** Flag to indicate if the form is in creation mode */
    newQuestion: boolean = false;
    /** Flag to indicate if the form is in update mode */
    isUpdateMode: boolean = false;
    /** List of survey categories */
    categories: any[] = [
        { label: 'Testing', value: 'Testing' },
        { label: 'Robustness', value: 'Robustness' },
        { label: 'Explainability', value: 'Explainability' }
    ];
    /** List of filtered categories */
    filteredCategories: any[];
    /** Form group for survey form controls */
    surveyForm: FormGroup;
    /** List of studies */
    studies: Study[];
    /** The selected study */
    selectedStudy: Study;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.studyService.getStudyList().pipe(takeUntil(this.destroy$)).subscribe(studies => this.studies = studies);
        this.initializeForm();
        this.loadSurvey();
    }

    /**
     * Responds to changes in input properties.
     * @param changes The changes in input properties
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayForm'] && this.displayForm) {
            this.loadSurvey();
        }
    }

    /**
     * Loads the survey details if a survey ID is provided.
     */
    loadSurvey() {
        if (this.studies.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('Warning'),
                detail: this.translateService.instant('SurveyManagement.NoStudies')
            });
            this.closeDialog();
            return;
        }

        if (this.surveyId) {
            this.newQuestion = false;
            this.isUpdateMode = true;
            this.surveyService.getSurveyById(this.surveyId).pipe(takeUntil(this.destroy$))
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
        } else {
            this.newQuestion = true;
            this.isUpdateMode = false;
            this.selectedQuestion = new Survey({});
            this.initializeForm();
        }
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.surveyForm = new FormGroup({
            question: new FormControl(this.selectedQuestion.question, Validators.required),
            answer: new FormControl(this.selectedQuestion.answer, Validators.required),
            category: new FormControl(this.selectedQuestion.category, Validators.required),
            study: new FormControl({ value: this.selectedQuestion.studyId, disabled: this.isUpdateMode }, Validators.required)
        });
    }

    /**
     * Saves the survey question.
     */
    saveQuestion() {
        if (!this.surveyForm.valid) {
            this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: this.translateService.instant('SurveyManagement.FormInvalid')
            });
            return;
        }

        const formValues = this.surveyForm.value;
        formValues.category = formValues.category.value || formValues.category;  // Ensure category is a string

        if (this.isUpdateMode) {
            formValues.studyId = this.selectedQuestion.studyId;
        } else {
            formValues.studyId = this.surveyForm.get('study')?.value.id;
        }

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
                            detail: this.translateService.instant('SurveyManagement.Survey is created successfully')
                        });
                        this.closeDialog(true);
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
            const updatedSurvey: Survey = new Survey({ surveyId: this.selectedQuestion.surveyId, ...formValues });
            this.surveyService.updateSurvey(updatedSurvey)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: survey => {
                        this.selectedQuestion = survey;
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('SurveyManagement.Survey is updated successfully')
                        });
                        this.closeDialog(true);
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
     * Closes the dialog and optionally refreshes the parent component.
     * @param refresh Indicates whether to refresh the parent component
     */
    closeDialog(refresh: boolean = false) {
        this.displayForm = false;
        this.formClosed.emit();
        if (refresh) {
            this.router.navigate(['survey-management']);
        }
    }

    /**
     * Filters the categories based on the input event.
     * @param event The auto-complete complete event
     */
    filterCategory(event: AutoCompleteCompleteEvent) {
        const query = event.query;
        this.filteredCategories = this.categories.filter(category => category.label.toLowerCase().includes(query.toLowerCase()));
    }
}






