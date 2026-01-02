import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { LearningStage } from '../../../../../shared/models/learningStage.model';
import { Dataset } from '../../../../../shared/models/dataset.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing and displaying the learning stages creation table.
 */
@Component({
    selector: 'app-learning-stage-creation-table',
    templateUrl: './ls-creation-table.component.html',
    styleUrls: ['./ls-creation-table.component.scss']
})
export class LsCreationTableComponent extends BaseComponent implements OnInit {

    /** The ID of the learning process */
    learningProcessId: string;

    /** List of learning stages */
    learningStages: LearningStage[] = [];

    /** Dictionary of datasets keyed by their ID */
    datasets: { [key: string]: Dataset } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning stage ID selected for editing */
    selectedLearningStageId: string = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

    /** Visibility flag for cascade validation dialog */
    displayCascadeDialog: boolean = false;

    /** List of tables to display in the validation dialog */
    cascadeTables: string = '';

    /** Authorization status for the validation dialog */
    cascadeAuthorized: boolean = false;

    /** Temporary storage of the learning stage ID pending deletion */
    pendingDeletionId: string = null;

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
        this.columns = [
            { field: 'learningStageName', header: 'LearningProcessManagement.LearningStageName' },
            { field: 'description', header: 'LearningProcessManagement.Description' },
            { field: 'datasetPercentage', header: 'LearningProcessManagement.DatasetPercentage' }
        ];

        this.route.parent.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.learningProcessId = params.get('id');
            this.loadLearningStages();
        });
    }

    /**
     * Loads the learning stages associated with the selected learning process.
     */
    loadLearningStages() {
        this.learningStageService.getLearningStagesByLearningProcessId(this.learningProcessId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningStages => {
                    this.learningStages = learningStages;
                    this.loadDatasets();
                    this.loading = false;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Loads all datasets and maps them by their ID.
     */
    loadDatasets() {
        this.datasetService.getAllDatasetsByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => {
                    datasets.forEach(dataset => {
                        this.datasets[dataset.datasetId] = dataset;
                    });
                },
                error: error => {
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
     * Initiates the deletion process by validating permissions first.
     * @param learningStage The learning stage to be deleted
     */
    deleteLearningStage(learningStage: LearningStage) {
        this.pendingDeletionId = learningStage.learningStageId;

        this.learningStageService.validateLearningStageDeletion(learningStage.learningStageId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: string) => {
                    if (!response || response.trim() === '') {
                        this.executeDeletion(this.pendingDeletionId);
                    } else {
                        this.cascadeTables = response;
                        this.cascadeAuthorized = true;
                        this.displayCascadeDialog = true;
                    }
                },
                error: (error: any) => {
                    if (error.status === 409) {
                        this.cascadeTables = error.error || '';
                        this.cascadeAuthorized = false;
                        this.displayCascadeDialog = true;
                    } else {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                        this.pendingDeletionId = null;
                    }
                }
            });
    }

    /**
     * Executes the actual deletion after validation or confirmation.
     * @param learningStageId The ID of the learning stage to be deleted
     */
    executeDeletion(learningStageId: string) {
        this.learningStageService.deleteLearningStage(learningStageId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningStages = this.learningStages.filter(
                        ls => ls.learningStageId !== learningStageId
                    );
                    this.translateService.get(['Success', 'LearningProcessManagement.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['LearningProcessManagement.Deleted']
                        });
                    });
                    this.pendingDeletionId = null;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.pendingDeletionId = null;
                }
            });
    }

    /**
     * Handles the cancellation of the cascade dialog.
     */
    onCascadeDialogCancel() {
        this.displayCascadeDialog = false;
        this.pendingDeletionId = null;
        this.cascadeTables = '';
    }

    /**
     * Displays the form for editing a learning stage.
     * @param learningStage The learning stage to be edited
     */
    showLearningStageForm(learningStage: LearningStage) {
        this.selectedLearningStageId = learningStage.learningStageId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new learning stage.
     */
    createLearningStage() {
        this.selectedLearningStageId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadLearningStages();
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates to the learning stage parameter assignment table.
     * @param learningStageId The ID of the selected learning stage
     */
    goToLearningStageParameterAssignment(learningStageId: string) {
        this.router.navigate([`/learning-process-management/${this.learningProcessId}/learning-stage-management/${learningStageId}/learning-stage-parameter-assignment`]);
    }
}
