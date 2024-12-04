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
    learningProcessId: number;

    /** List of learning stages */
    learningStages: LearningStage[] = [];

    /** Dictionary of datasets keyed by their ID */
    datasets: { [key: number]: Dataset } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning stage ID selected for editing */
    selectedLearningStageId: number = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

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
            this.learningProcessId = +params.get('id');
            this.loadLearningStages();
        });
    }

    /**
     * Loads the learning stages associated with the selected learning process.
     */
    loadLearningStages() {
        this.learningStageService.getLearningStagesByLearningProcessId(this.learningProcessId, +this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningStages => {
                    this.learningStages = learningStages;
                    this.loadDatasets();
                    this.loading = false;
                },
                error: error => {
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
     * Loads all datasets and maps them by their ID.
     */
    loadDatasets() {
        this.datasetService.getAllDatasetsByStudyId(+this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => {
                    datasets.forEach(dataset => {
                        this.datasets[dataset.datasetId] = dataset;
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
     * Deletes a learning stage by its ID.
     * @param learningStage The learning stage to be deleted
     */
    deleteLearningStage(learningStage: LearningStage) {
        this.learningStageService.deleteLearningStage(learningStage.learningStageId, +this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningStages = this.learningStages.filter(
                        ls => ls.learningStageId !== learningStage.learningStageId
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningProcessManagement.Deleted')
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
    goToLearningStageParameterAssignment(learningStageId: number) {
        this.router.navigate([`/learning-process-management/${this.learningProcessId}/learning-stage-management/${learningStageId}/learning-stage-parameter-assignment`]);
    }
}
