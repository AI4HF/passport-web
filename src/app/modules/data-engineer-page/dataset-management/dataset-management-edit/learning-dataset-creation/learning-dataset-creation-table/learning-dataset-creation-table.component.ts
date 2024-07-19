import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { LearningDataset } from "../../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../../../shared/models/dataset.model";

/**
 * Component for managing and displaying the learning datasets creation table.
 */
@Component({
    selector: 'app-learning-dataset-creation-table',
    templateUrl: './learning-dataset-creation-table.component.html',
    styleUrls: ['./learning-dataset-creation-table.component.scss']
})
export class LearningDatasetCreationTableComponent extends BaseComponent implements OnInit {

    /** The selected dataset */
    selectedDataset: Dataset;

    /** List of learning datasets */
    learningDatasets: LearningDataset[] = [];

    /** Dictionary of dataset transformations keyed by their ID */
    datasetTransformations: { [key: number]: DatasetTransformation } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning dataset selected for editing */
    selectedLearningDataset: LearningDataset = null;

    /** The transformation selected for editing */
    selectedTransformation: DatasetTransformation = null;

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
            { field: 'description', header: 'LearningDataset.Description' },
            { field: 'transformationTitle', header: 'LearningDataset.TransformationTitle' },
            { field: 'transformationDescription', header: 'LearningDataset.TransformationDescription' }
        ];

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.selectedDataset = data['dataset'];
            this.loadLearningDatasets();
        });
    }

    /**
     * Loads the learning datasets associated with the selected dataset.
     */
    loadLearningDatasets() {
        this.learningDatasetService.getLearningDatasetsByDatasetId(this.selectedDataset.datasetId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningDatasets => {
                    this.learningDatasets = learningDatasets;
                    this.loadDatasetTransformations();
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
     * Loads the dataset transformations associated with the learning datasets.
     */
    loadDatasetTransformations() {
        this.learningDatasets.forEach(learningDataset => {
            this.datasetTransformationService.getDatasetTransformationById(learningDataset.dataTransformationId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(transformation => {
                    this.datasetTransformations[learningDataset.dataTransformationId] = transformation;
                });
        });
    }

    /**
     * Deletes a learning dataset by its ID.
     * @param learningDataset The learning dataset to be deleted
     */
    deleteLearningDataset(learningDataset: LearningDataset) {
        this.learningDatasetService.deleteLearningDataset(learningDataset.learningDatasetId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningDatasets = this.learningDatasets.filter(ld => ld.learningDatasetId !== learningDataset.learningDatasetId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningDataset.Deleted')
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
     * Displays the form for editing a learning dataset.
     * @param learningDataset The learning dataset to be edited
     */
    showLearningDatasetForm(learningDataset: LearningDataset) {
        this.selectedLearningDataset = learningDataset;
        this.selectedTransformation = this.datasetTransformations[learningDataset.dataTransformationId];
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new learning dataset.
     */
    createLearningDataset() {
        this.selectedLearningDataset = null;
        this.selectedTransformation = null;
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

