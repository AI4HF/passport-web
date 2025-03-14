import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Survey } from "../../../shared/models/survey.model";
import { takeUntil } from "rxjs/operators";

/**
 * Component for managing the survey table.
 */
@Component({
    selector: 'app-survey-management-table',
    templateUrl: './survey-management-table.component.html',
    styleUrls: ['./survey-management-table.component.scss']
})
export class SurveyManagementTableComponent extends BaseComponent implements OnInit {
    /** List of surveys */
    surveyList: Survey[] = [];
    /** Columns to be displayed in the table */
    columns: any[];
    /** Loading state of the table */
    loading: boolean = true;
    /** Determines if the form is displayed */
    displayForm: boolean = false;
    /** The ID of the selected survey for editing */
    selectedSurveyId: string = null;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(
        protected injector: Injector,
    ) {
        super(injector);
        this.columns = [
            { header: 'ID', field: 'surveyId' },
            { header: 'Question', field: 'question' },
            { header: 'Answer', field: 'answer' },
            { header: 'Category', field: 'category' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        if(this.activeStudyService.getActiveStudy()){
            this.loadSurveys(this.activeStudyService.getActiveStudy());
        }
    }

    /**
     * Loads surveys by studyId.
     * @param studyId
     */
    loadSurveys(studyId: String) {
        this.surveyService.getSurveysByStudyId(studyId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (surveys) => {
                this.surveyList = surveys.map(survey => new Survey(survey));
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Shows the form for creating a new survey.
     */
    createQuestion() {
        this.selectedSurveyId = null;
        this.displayForm = true;
    }

    /**
     * Shows the form for editing an existing survey.
     * @param survey The survey to be edited
     */
    editQuestion(survey: Survey) {
        this.selectedSurveyId = survey.surveyId;
        this.displayForm = true;
    }

    /**
     * Deletes the selected survey.
     * @param surveyId The ID of the survey to be deleted
     */
    deleteQuestion(surveyId: string) {
        this.surveyService.deleteSurvey(surveyId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.surveyList = this.surveyList.filter(survey => survey.surveyId !== surveyId);
                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('Success'),
                    detail: this.translateService.instant('SurveyManagement.Survey is deleted successfully')
                });
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.selectedSurveyId = null;
        this.displayForm = false;
        this.loadSurveys(this.activeStudyService.getActiveStudy());
    }
}