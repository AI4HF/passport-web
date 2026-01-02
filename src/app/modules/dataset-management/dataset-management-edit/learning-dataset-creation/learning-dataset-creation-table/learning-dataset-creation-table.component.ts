import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { LearningDataset } from "../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../shared/models/datasetTransformation.model";
import {forkJoin, of, takeUntil} from "rxjs";
import {catchError, map} from "rxjs/operators";

/**
 * Component for managing and displaying the learning datasets creation table.
 */
@Component({
    selector: 'app-learning-dataset-creation-table',
    templateUrl: './learning-dataset-creation-table.component.html',
    styleUrls: ['./learning-dataset-creation-table.component.scss']
})
export class LearningDatasetCreationTableComponent extends BaseComponent implements OnInit {

    /** The selected dataset's ID */
    selectedDatasetId: string;

    /** List of learning datasets */
    learningDatasets: LearningDataset[] = [];

    /** Dictionary of dataset transformations keyed by their ID */
    datasetTransformations: { [key: string]: DatasetTransformation } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning dataset ID selected for editing */
    selectedLearningDatasetId: string = null;

    /** The data transformation ID selected for editing */
    selectedDataTransformationId: string = null;

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

    /** Temporary storage of the learning dataset object pending deletion */
    pendingDeletionObject: LearningDataset = null;

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
            { field: 'description', header: 'DatasetManagement.Description' },
            { field: 'transformationTitle', header: 'DatasetManagement.TransformationTitle' },
            { field: 'transformationDescription', header: 'DatasetManagement.TransformationDescription' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.selectedDatasetId = params.get('id');
            this.loadLearningDatasets();
        });
    }

    /**
     * Loads the learning datasets associated with the selected dataset.
     */
    loadLearningDatasets() {
        this.learningDatasetService.getLearningDatasetsByDatasetId(this.selectedDatasetId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningDatasets => {
                    this.learningDatasets = learningDatasets;
                    this.loadDatasetTransformations();
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
     * Loads the dataset transformations associated with the learning datasets.
     */
    loadDatasetTransformations() {
        this.learningDatasets.forEach(learningDataset => {
            this.datasetTransformationService.getDatasetTransformationById(learningDataset.dataTransformationId, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: transformation => {
                        this.datasetTransformations[learningDataset.dataTransformationId] = transformation;
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
        });
    }

    /**
     * Initiates the deletion process by validating permissions for BOTH LearningDataset and DatasetTransformation.
     * @param learningDataset The learning dataset to be deleted
     */
    deleteLearningDataset(learningDataset: LearningDataset) {
        this.pendingDeletionObject = learningDataset;

        const validateLd$ = this.learningDatasetService.validateLearningDatasetDeletion(
            learningDataset.learningDatasetId,
            this.activeStudyService.getActiveStudy()
        ).pipe(
            map(response => ({ status: 200, tables: response })),
            catchError(error => of({ status: error.status, tables: error.error || '' }))
        );

        const validateDt$ = this.datasetTransformationService.validateDatasetTransformationDeletion(
            learningDataset.dataTransformationId,
            this.activeStudyService.getActiveStudy()
        ).pipe(
            map(response => ({ status: 200, tables: response })),
            catchError(error => of({ status: error.status, tables: error.error || '' }))
        );

        forkJoin([validateLd$, validateDt$])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (results) => {
                    const allTables = [
                        ... (results[0].tables ? results[0].tables.split(',') : []),
                        ... (results[1].tables ? results[1].tables.split(',') : [])
                    ];

                    const uniqueTables = [...new Set(allTables
                        .map(t => t.trim())
                        .filter(t => t !== ''
                            && t.toLowerCase() !== 'learningdataset'
                            && t.toLowerCase() !== 'datasettransformation')
                    )];

                    const isUnauthorized = results.some(r => r.status === 409);

                    if (uniqueTables.length === 0) {
                        this.executeDeletion(this.pendingDeletionObject);
                    } else {
                        this.cascadeTables = uniqueTables.join(', ');
                        this.cascadeAuthorized = !isUnauthorized;
                        this.displayCascadeDialog = true;
                    }
                },
                error: (error: any) => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message || 'An unexpected error occurred during validation.'
                        });
                    });
                    this.pendingDeletionObject = null;
                }
            });
    }

    /**
     * Executes the actual deletion after validation or confirmation.
     * @param learningDataset The learning dataset object to be deleted
     */
    executeDeletion(learningDataset: LearningDataset) {
        this.datasetTransformationService.deleteDatasetTransformation(learningDataset.dataTransformationId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningDatasets = this.learningDatasets.filter(ld => ld.learningDatasetId !== learningDataset.learningDatasetId);
                    delete this.datasetTransformations[learningDataset.dataTransformationId];
                    this.translateService.get(['Success', 'DatasetManagement.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['DatasetManagement.Deleted']
                        });
                    });
                    this.pendingDeletionObject = null;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.pendingDeletionObject = null;
                }
            });
    }

    /**
     * Handles the cancellation of the cascade dialog.
     */
    onCascadeDialogCancel() {
        this.displayCascadeDialog = false;
        this.pendingDeletionObject = null;
        this.cascadeTables = '';
    }

    /**
     * Displays the form for editing a learning dataset.
     * @param learningDataset The learning dataset to be edited
     */
    showLearningDatasetForm(learningDataset: LearningDataset) {
        this.selectedLearningDatasetId = learningDataset.learningDatasetId;
        this.selectedDataTransformationId = learningDataset.dataTransformationId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new learning dataset.
     */
    createLearningDataset() {
        this.selectedLearningDatasetId = null;
        this.selectedDataTransformationId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadLearningDatasets();
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
