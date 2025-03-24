import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Survey } from "../../../shared/models/survey.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";

/**
 * Component for creating or updating surveys.
 */
@Component({
    selector: 'app-survey-management-form',
    templateUrl: './survey-management-form.component.html',
    styleUrls: ['./survey-management-form.component.scss']
})
export class SurveyManagementFormComponent extends BaseComponent implements OnInit {

    @Input() surveyId: string;
    @Output() formClosed = new EventEmitter<void>();

    selectedSurvey: Survey;
    surveyForm: FormGroup;
    display = false;

    /** List of predefined categories */
    categories: any[] = [
        { label: 'Testing', value: 'Testing' },
        { label: 'Robustness', value: 'Robustness' },
        { label: 'Explainability', value: 'Explainability' }
    ];

    /** Filtered categories for autocomplete */
    filteredCategories: string[] = [];

    /** List of surveys loaded from JSON */
    hardcodedSurveys: Survey[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredSurveys: Survey[] = [];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param http The HTTP client for loading JSON
     */
    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadSurvey();
        this.loadHardcodedSurveys();
    }

    /**
     * Loads the survey details if a survey ID is provided.
     */
    loadSurvey() {
        if (this.surveyId) {
            this.surveyService.getSurveyById(this.surveyId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: survey => {
                        this.selectedSurvey = survey;
                        this.initializeForm();
                    },
                    error: error => {
                        if (error.status === 404) {
                            this.selectedSurvey = new Survey({});
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        } else {
            this.selectedSurvey = new Survey({});
            this.initializeForm();
        }
    }

    /**
     * Loads the predefined surveys from a JSON file for auto-fill functionality.
     */
    loadHardcodedSurveys() {
        this.http.get<Survey[]>('assets/data/example-surveys.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedSurveys = data,
                error: err => console.error('Failed to load hardcoded surveys', err)
            });
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.surveyForm = new FormGroup({
            question: new FormControl(this.selectedSurvey.question, Validators.required),
            answer: new FormControl(this.selectedSurvey.answer, Validators.required),
            category: new FormControl(this.selectedSurvey.category, Validators.required)
        });
        this.display = true;
    }

    /**
     * Filters the surveys based on the input query for auto-fill.
     * @param event The auto-complete complete event
     */
    filterSurveys(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredSurveys = this.hardcodedSurveys.filter(survey =>
            survey.question.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills the form with the selected predefined survey.
     * @param event The auto-complete select event
     */
    selectAutoFill(event: any) {
        const selectedSurvey = event.value;
        this.surveyForm.setValue({
            question: selectedSurvey.question,
            answer: selectedSurvey.answer,
            category: selectedSurvey.category
        });
    }

    /**
     * Saves the survey data, either creating or updating it.
     */
    saveQuestion() {
        const formValue = this.surveyForm.value;
        const categoryValue = typeof formValue.category === 'object' ? formValue.category.value : formValue.category;
        const surveyData = {
            ...formValue,
            category: categoryValue,
            studyId: this.activeStudyService.getActiveStudy()
        };

        if (!this.selectedSurvey.surveyId) {
            const newSurvey: Survey = new Survey(surveyData);
            this.surveyService.createSurvey(newSurvey, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
                next: survey => {
                    this.selectedSurvey = survey;
                    this.initializeForm();
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('SurveyManagement.Survey is created successfully')
                    });
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                },
                complete: () => {
                    this.closeDialog();
                }
            });
        } else {
            const updatedSurvey: Survey = new Survey({
                surveyId: this.selectedSurvey.surveyId,
                ...surveyData,
                studyId: this.selectedSurvey.studyId
            });
            this.surveyService.updateSurvey(updatedSurvey, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
                next: survey => {
                    this.selectedSurvey = survey;
                    this.initializeForm();
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('SurveyManagement.Survey is updated successfully')
                    });
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                },
                complete: () => {
                    this.closeDialog();
                }
            });
        }
    }

    /**
     * Closes the dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
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
