import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Survey } from "../../../shared/models/survey.model";
import { takeUntil } from "rxjs/operators";
import { forkJoin } from 'rxjs';

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
    surveyList: any[] = [];
    /** Columns to be displayed in the table */
    columns: any[];
    /** Loading state of the table */
    loading: boolean = true;
    /** Determines if the form is displayed */
    displayForm: boolean = false;
    /** The ID of the selected survey for editing */
    selectedSurveyId: number = null;
    /** List of studies */
    studies: any[] = [];

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
            { header: 'Category', field: 'category' },
            { header: 'Study', field: 'studyName' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadData();
    }

    /**
     * Loads surveys and studies data.
     */
    loadData() {
        forkJoin([
            this.surveyService.getAllSurveys().pipe(takeUntil(this.destroy$)),
            this.studyService.getStudyList().pipe(takeUntil(this.destroy$))
        ]).subscribe({
            next: ([surveys, studies]) => {
                this.surveyList = surveys.map(survey => ({ ...survey, studyName: '' }));
                this.studies = studies.map(study => ({ id: study.id, name: study.name }));
                this.mapStudiesToSurveys();
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
     * Maps studies to surveys to populate the study name for each survey.
     */
    mapStudiesToSurveys() {
        this.surveyList.forEach(survey => {
            const study = this.studies.find(s => s.id === survey.studyId);
            survey.studyName = study ? study.name : '';
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
    deleteQuestion(surveyId: number) {
        this.surveyService.deleteSurvey(surveyId).pipe(takeUntil(this.destroy$)).subscribe({
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
        this.loadData();
    }
}