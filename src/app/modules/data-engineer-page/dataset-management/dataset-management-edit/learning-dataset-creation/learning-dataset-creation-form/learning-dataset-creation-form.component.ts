import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningDataset } from "../../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing and displaying the form for creating or updating learning datasets and their transformations.
 */
@Component({
    selector: 'app-learning-dataset-creation-form',
    templateUrl: './learning-dataset-creation-form.component.html',
    styleUrls: ['./learning-dataset-creation-form.component.scss']
})
export class LearningDatasetCreationFormComponent extends BaseComponent implements OnInit, OnChanges {

    /** The ID of the dataset */
    @Input() datasetId: number;

    /** The learning dataset to be edited or created */
    @Input() learningDataset: LearningDataset;

    /** The transformation associated with the learning dataset */
    @Input() transformation: DatasetTransformation;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the learning dataset and transformation */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

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
        this.initializeForm();
    }

    /**
     * Handles changes to input properties.
     * @param changes The changes to input properties
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['learningDataset'] || changes['transformation']) {
            this.initializeForm();
        }
    }

    /**
     * Initializes the form group with the learning dataset and transformation data.
     */
    initializeForm() {
        this.form = new FormGroup({
            transformationTitle: new FormControl(this.transformation?.title || '', Validators.required),
            transformationDescription: new FormControl(this.transformation?.description || '', Validators.required),
            learningDatasetDescription: new FormControl(this.learningDataset?.description || '', Validators.required)
        });
        this.display = true;
    }

    /**
     * Saves the learning dataset and transformation, either creating new ones or updating existing ones.
     */
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

    /**
     * Updates an existing transformation and the associated learning dataset.
     * @param transformationPayload The payload with the transformation data
     * @param learningDatasetPayload The payload with the learning dataset data
     */
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

    /**
     * Creates a new transformation and the associated learning dataset.
     * @param transformationPayload The payload with the transformation data
     * @param learningDatasetPayload The payload with the learning dataset data
     */
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

    /**
     * Saves the learning dataset with the given transformation ID.
     * @param transformationId The ID of the transformation
     * @param learningDatasetPayload The payload with the learning dataset data
     */
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

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}

