import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { LearningProcessDataset } from '../../../../../../shared/models/learningProcessDataset.model';
import { Dataset } from '../../../../../../shared/models/dataset.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing and displaying the learning process datasets assignment table.
 */
@Component({
    selector: 'app-learning-process-dataset-assignment-table',
    templateUrl: './learning-process-dataset-assignment-table.component.html',
    styleUrls: ['./learning-process-dataset-assignment-table.component.scss']
})
export class LearningProcessDatasetAssignmentTableComponent extends BaseComponent implements OnInit {

    /** The ID of the learning process */
    learningProcessId: string;

    /** List of learning process datasets */
    learningProcessDatasets: LearningProcessDataset[] = [];

    /** Dictionary of datasets keyed by their ID */
    datasets: { [key: number]: Dataset } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning process dataset ID selected for editing */
    selectedLearningProcessDatasetId: string = null;

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
            { field: 'description', header: 'LearningProcessManagement.Description' },
            { field: 'datasetName', header: 'LearningProcessManagement.DatasetName' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.learningProcessId = params.get('id');
            this.loadLearningProcessDatasets();
        });
    }

    /**
     * Loads the learning process datasets associated with the selected learning process.
     */
    loadLearningProcessDatasets() {
        this.learningProcessDatasetService.getLearningProcessDatasetsByLearningProcessId(this.learningProcessId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessDatasets => {
                    this.learningProcessDatasets = learningProcessDatasets;
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
        this.datasetService.getAllDatasets().pipe(takeUntil(this.destroy$))
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
     * Deletes a learning process dataset by its ID.
     * @param learningProcessDataset The learning process dataset to be deleted
     */
    deleteLearningProcessDataset(learningProcessDataset: LearningProcessDataset) {
        this.learningProcessDatasetService.deleteLearningProcessDataset(
            learningProcessDataset.learningProcessId,
            learningProcessDataset.learningDatasetId
        ).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningProcessDatasets = this.learningProcessDatasets.filter(
                        lpd => lpd.learningProcessId !== learningProcessDataset.learningProcessId
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
     * Displays the form for editing a learning process dataset.
     * @param learningProcessDataset The learning process dataset to be edited
     */
    showLearningProcessDatasetForm(learningProcessDataset: LearningProcessDataset) {
        this.selectedLearningProcessDatasetId = learningProcessDataset.learningDatasetId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new learning process dataset.
     */
    createLearningProcessDataset() {
        this.selectedLearningProcessDatasetId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadLearningProcessDatasets();
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
     * Navigates to the learning stage creation table.
     */
    goToLearningStageCreation() {
        this.router.navigate([`/learning-process-management-edit/learning-dataset-creation`]);
    }
}
