import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { LearningDataset } from "../../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { DatasetTransformationStep } from "../../../../../../shared/models/datasetTransformationStep.model";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../../../shared/models/dataset.model";

@Component({
    selector: 'app-creation-step-assignment-table',
    templateUrl: './creation-step-assignment-table.component.html',
    styleUrls: ['./creation-step-assignment-table.component.scss']
})
export class CreationStepAssignmentTableComponent extends BaseComponent implements OnInit {

    selectedDataset: Dataset;
    learningDatasets: LearningDataset[] = [];
    transformations: DatasetTransformation[] = [];
    selectedTransformation: DatasetTransformation = null;
    transformationSteps: DatasetTransformationStep[] = [];
    displayForm: boolean = false;
    selectedStep: DatasetTransformationStep = null;
    loading: boolean = true;
    columns: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.columns = [
            { field: 'inputFeatures', header: 'Input Features' },
            { field: 'outputFeatures', header: 'Output Features' },
            { field: 'method', header: 'Transformation Step Method' },
            { field: 'explanation', header: 'Explanation' }
        ];

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.selectedDataset = data['dataset'];
            this.loadLearningDatasets();
        });
    }


    loadLearningDatasets() {
        this.learningDatasetService.getLearningDatasetsByDatasetId(this.selectedDataset.datasetId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningDatasets => {
                    this.learningDatasets = learningDatasets;
                    this.loadDatasetTransformations();
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

    loadDatasetTransformations() {
        this.learningDatasets.forEach(learningDataset => {
            this.datasetTransformationService.getDatasetTransformationById(learningDataset.dataTransformationId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(transformation => {
                    this.transformations.push(transformation);
                });
        });
    }

    onTransformationSelect() {
        if (this.selectedTransformation) {
            this.loadTransformationSteps();
        } else {
            this.transformationSteps = [];
        }
    }

    loadTransformationSteps() {
        this.transformationStepService.getDatasetTransformationStepsByTransformationId(this.selectedTransformation.dataTransformationId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: steps => {
                    this.transformationSteps = steps;
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

    deleteTransformationStep(step: DatasetTransformationStep) {
        this.transformationStepService.deleteDatasetTransformationStep(step.stepId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.transformationSteps = this.transformationSteps.filter(s => s.stepId !== step.stepId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('Transformation Step Deleted')
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

    showTransformationStepForm(step: DatasetTransformationStep) {
        this.selectedStep = step;
        this.displayForm = true;
    }

    createTransformationStep() {
        this.selectedStep = null;
        this.displayForm = true;
    }

    onFormClosed() {
        this.displayForm = false;
        this.loadTransformationSteps();
    }

    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
