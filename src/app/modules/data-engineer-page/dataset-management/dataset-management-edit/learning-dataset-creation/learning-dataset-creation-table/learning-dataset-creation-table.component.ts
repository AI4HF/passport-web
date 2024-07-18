import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { LearningDataset } from "../../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../../../shared/models/dataset.model";

@Component({
    selector: 'app-learning-dataset-creation-table',
    templateUrl: './learning-dataset-creation-table.component.html',
    styleUrls: ['./learning-dataset-creation-table.component.scss']
})
export class LearningDatasetCreationTableComponent extends BaseComponent implements OnInit {

    selectedDataset: Dataset;
    learningDatasets: LearningDataset[] = [];
    datasetTransformations: { [key: number]: DatasetTransformation } = {};
    displayForm: boolean = false;
    selectedLearningDataset: LearningDataset = null;
    selectedTransformation: DatasetTransformation = null;
    loading: boolean = true;
    columns: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

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

    loadDatasetTransformations() {
        this.learningDatasets.forEach(learningDataset => {
            this.datasetTransformationService.getDatasetTransformationById(learningDataset.dataTransformationId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(transformation => {
                    this.datasetTransformations[learningDataset.dataTransformationId] = transformation;
                });
        });
    }

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

    showLearningDatasetForm(learningDataset: LearningDataset) {
        this.selectedLearningDataset = learningDataset;
        this.selectedTransformation = this.datasetTransformations[learningDataset.dataTransformationId];
        this.displayForm = true;
    }

    createLearningDataset() {
        this.selectedLearningDataset = null;
        this.selectedTransformation = null;
        this.displayForm = true;
    }

    onFormClosed() {
        this.displayForm = false;
        this.loadLearningDatasets();
    }

    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
