import { Component, OnInit, Injector } from '@angular/core';
import { Survey } from '../../../shared/models/survey.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base.component';

/**
 * Component for managing the survey table
 */
@Component({
    selector: 'app-survey-management-table',
    templateUrl: './survey-management-table.component.html',
    styleUrls: ['./survey-management-table.component.scss']
})
export class SurveyManagementTableComponent extends BaseComponent implements OnInit {
    surveyList: Survey[];
    columns: any[];
    loading: boolean = true;

    constructor(protected injector: Injector) {
        super(injector);
        this.columns = [
            { header: 'ID', field: 'surveyId' },
            { header: 'Question', field: 'question' },
            { header: 'Answer', field: 'answer' },
            { header: 'Category', field: 'category' }
        ];
    }

    ngOnInit() {
        this.surveyService.getSurveysByStudyId(1).pipe(takeUntil(this.destroy$))
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
     * Filter table based on global search input
     */
    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigate to create a new question
     */
    createQuestion() {
        this.router.navigate(['survey-management/form/new']);
    }

    /**
     * Navigate to edit an existing question
     * @param survey Survey object to be edited
     */
    editQuestion(survey: Survey) {
        this.router.navigate([`survey-management/form/${survey.surveyId}`], { state: { survey } });
    }

    /**
     * Delete a question by survey ID
     * @param surveyId ID of the survey to be deleted
     */
    deleteQuestion(surveyId: number) {
        this.surveyService.deleteSurvey(surveyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.surveyList = this.surveyList.filter(q => q.surveyId !== surveyId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('SurveyManagement.Survey.Survey is deleted successfully')
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
}
