import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Survey } from "../../../shared/models/survey.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";

/**
 * Component for creating or updating surveys.
 */
@Component({
    selector: 'app-survey-management-form',
    templateUrl: './survey-management-form.component.html',
    styleUrls: ['./survey-management-form.component.scss']
})
export class SurveyManagementFormComponent extends BaseComponent implements OnInit {
    /** The ID of the survey to be edited */
    @Input() surveyId: number;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The selected survey */
    selectedSurvey: Survey;
    /** Form group for survey form controls */
    surveyForm: FormGroup;
    /** Flag indicating that dialog is visible */
    display = false;
    /** List of predefined categories */
    categories: any[] = [
        {label: 'Testing', value: 'Testing'},
        {label: 'Robustness', value: 'Robustness'},
        {label: 'Explainability', value: 'Explainability'}
    ];
    /** Filtered categories for autocomplete */
    filteredCategories: string[] = [];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(
        protected injector: Injector
    ) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        if(this.surveyId){
            this.surveyService.getSurveyById(this.surveyId).pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: survey => {
                        this.selectedSurvey = survey;
                        this.initializeForm();
                    },
                    error: error => {
                        if(error.status === 404) {
                            this.selectedSurvey = new Survey({});
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        }else{
            this.selectedSurvey = new Survey({});
            this.initializeForm();
        }
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
     * Saves the survey.
     */
    saveQuestion() {
        const formValue = this.surveyForm.value;
        const categoryValue = typeof formValue.category === 'object' ? formValue.category.value : formValue.category;
        const surveyData = {
            ...formValue,
            category: categoryValue,
            studyId: this.activeStudyService.getActiveStudy().id
        };

        if (!this.selectedSurvey.surveyId) {
            const newSurvey: Survey = new Survey(surveyData);
            this.surveyService.createSurvey(newSurvey).pipe(takeUntil(this.destroy$)).subscribe({
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
            this.surveyService.updateSurvey(updatedSurvey).pipe(takeUntil(this.destroy$)).subscribe({
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