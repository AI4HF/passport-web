import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningDataset } from "../../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";

@Component({
    selector: 'app-learning-dataset-creation-form',
    templateUrl: './learning-dataset-creation-form.component.html',
    styleUrls: ['./learning-dataset-creation-form.component.scss']
})
export class LearningDatasetCreationFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() datasetId: number;
    @Input() learningDataset: LearningDataset;
    @Input() transformation: DatasetTransformation;
    @Output() formClosed = new EventEmitter<void>();

    form: FormGroup;
    display: boolean = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.initializeForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['learningDataset'] || changes['transformation']) {
            this.initializeForm();
        }
    }

    initializeForm() {
        this.form = new FormGroup({
            transformationTitle: new FormControl(this.transformation?.title || '', Validators.required),
            transformationDescription: new FormControl(this.transformation?.description || '', Validators.required),
            learningDatasetDescription: new FormControl(this.learningDataset?.description || '', Validators.required)
        });
        this.display = true;
    }

    save() {
        const formValues = this.form.value;

        const transformationPayload = {
            title: formValues.transformationTitle,
            description: formValues.transformationDescription
        };

        const learningDatasetPayload = {
            datasetId: this.datasetId,
            description: formValues.learningDatasetDescription
        };

        if (this.transformation && this.transformation.dataTransformationId) {
            this.updateTransformation(transformationPayload, learningDatasetPayload);
        } else {
            this.createTransformation(transformationPayload, learningDatasetPayload);
        }
    }

    updateTransformation(transformationPayload: any, learningDatasetPayload: any) {
        this.datasetTransformationService.updateDatasetTransformation({
            ...this.transformation,
            ...transformationPayload
        }).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: transformation => {
                this.saveLearningDataset(transformation.dataTransformationId, learningDatasetPayload);
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

    createTransformation(transformationPayload: any, learningDatasetPayload: any) {
        this.datasetTransformationService.createDatasetTransformation(transformationPayload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: transformation => {
                    this.saveLearningDataset(transformation.dataTransformationId, learningDatasetPayload);
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

    saveLearningDataset(transformationId: number, learningDatasetPayload: any) {
        const payload = {
            ...learningDatasetPayload,
            dataTransformationId: transformationId
        };

        if (this.learningDataset && this.learningDataset.learningDatasetId) {
            this.learningDatasetService.updateLearningDataset({
                ...this.learningDataset,
                ...payload
            }).pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningDataset.Updated')
                    });
                    this.closeDialog();
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        } else {
            this.learningDatasetService.createLearningDataset(payload).pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningDataset.Created')
                    });
                    this.closeDialog();
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
    }

    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
