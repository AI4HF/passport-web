import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { LearningDataset } from "../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../shared/models/datasetTransformation.model";
import { DatasetTransformationStep } from "../../../../../shared/models/datasetTransformationStep.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing and displaying dataset transformation steps.
 */
@Component({
    selector: 'app-creation-step-assignment-table',
    templateUrl: './creation-step-assignment-table.component.html',
    styleUrls: ['./creation-step-assignment-table.component.scss']
})
export class CreationStepAssignmentTableComponent extends BaseComponent implements OnInit {

    /** The selected dataset's ID */
    selectedDatasetId: string;

    /** List of learning datasets */
    learningDatasets: LearningDataset[] = [];

    /** List of dataset transformations */
    transformations: DatasetTransformation[] = [];

    /** The selected dataset transformation */
    selectedTransformation: DatasetTransformation = null;

    /** List of transformation steps */
    transformationSteps: DatasetTransformationStep[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The selected transformation step for editing */
    selectedStep: DatasetTransformationStep = null;

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
            { field: 'inputFeatures', header: 'Input Features' },
            { field: 'outputFeatures', header: 'Output Features' },
            { field: 'method', header: 'Transformation Step Method' },
            { field: 'explanation', header: 'Explanation' }
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
     * Loads the dataset transformations associated with the learning datasets.
     */
    loadDatasetTransformations() {
        this.learningDatasets.forEach(learningDataset => {
            this.datasetTransformationService.getDatasetTransformationById(learningDataset.dataTransformationId, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe(transformation => {
                    this.transformations.push(transformation);
                });
        });
    }

    /**
     * Loads the transformation steps for the selected transformation.
     */
    onTransformationSelect() {
        if (this.selectedTransformation) {
            this.loadTransformationSteps();
        } else {
            this.transformationSteps = [];
        }
    }

    /**
     * Loads the transformation steps associated with the selected transformation.
     */
    loadTransformationSteps() {
        this.transformationStepService.getDatasetTransformationStepsByTransformationId(this.selectedTransformation.dataTransformationId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: steps => {
                    this.transformationSteps = steps;
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
     * Deletes a transformation step.
     * @param step The transformation step to be deleted
     */
    deleteTransformationStep(step: DatasetTransformationStep) {
        this.transformationStepService.deleteDatasetTransformationStep(step.stepId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.transformationSteps = this.transformationSteps.filter(s => s.stepId !== step.stepId);
                    this.translateService.get(['Success', 'Transformation Step Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['Transformation Step Deleted']
                        });
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
     * Displays the form for editing a transformation step.
     * @param step The transformation step to be edited
     */
    showTransformationStepForm(step: DatasetTransformationStep) {
        this.selectedStep = step;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new transformation step.
     */
    createTransformationStep() {
        this.selectedStep = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadTransformationSteps();
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
