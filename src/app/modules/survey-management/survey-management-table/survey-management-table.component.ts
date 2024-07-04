import { Component, OnInit, Injector } from '@angular/core';
import { Survey } from '../../../shared/models/survey.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base.component';
import { Study } from '../../../shared/models/study.model';

/**
 * Component to display and manage a list of survey questions.
 */
@Component({
    selector: 'app-survey-management-table',
    templateUrl: './survey-management-table.component.html',
    styleUrls: ['./survey-management-table.component.scss']
})
export class SurveyManagementTableComponent extends BaseComponent implements OnInit {
    /** List of survey questions */
    surveyList: Survey[];
    /** Columns to be displayed in the table */
    columns: any[];
    /** Loading state of the table */
    loading: boolean = true;
    /** List of studies */
    studies: Study[] = [];
    /** Determines if the form is displayed */
    displayForm: boolean = false;
    /** The ID of the selected survey question for editing */
    selectedSurveyId: number = null;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
        this.columns = [
            { header: 'ID', field: 'surveyId' },
            { header: 'Question', field: 'question' },
            { header: 'Answer', field: 'answer' },
            { header: 'Category', field: 'category' },
            { header: 'Study', field: 'study' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadStudies();
        this.loadSurveys();
    }

    /**
     * Loads the list of studies.
     */
    loadStudies() {
        this.studyService.getStudyList().pipe(takeUntil(this.destroy$)).subscribe(studies => this.studies = studies);
    }

    /**
     * Loads the list of survey questions.
     */
    loadSurveys() {
        this.surveyService.getAllSurveys().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: surveys => {
                    this.surveyList = surveys;
                    this.loading = false;
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Gets the name of the study for the given study ID.
     * @param studyId The ID of the study
     * @returns The name of the study
     */
    getStudyName(studyId: number): string {
        const study = this.studies.find(study => study.id === studyId);
        return study ? study.name : '';
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
     * Shows the form for creating a new survey question.
     */
    createQuestion() {
        this.selectedSurveyId = null;
        this.displayForm = true;
    }

    /**
     * Shows the form for editing an existing survey question.
     * @param survey The survey question to be edited
     */
    editQuestion(survey: Survey) {
        this.selectedSurveyId = survey.surveyId;
        this.displayForm = true;
    }

    /**
     * Deletes the selected survey question.
     * @param surveyId The ID of the survey question to be deleted
     */
    deleteQuestion(surveyId: number) {
        this.surveyService.deleteSurvey(surveyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.surveyList = this.surveyList.filter(q => q.surveyId !== surveyId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('SurveyManagement.Survey is deleted successfully')
                    });
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
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadSurveys();
    }
}