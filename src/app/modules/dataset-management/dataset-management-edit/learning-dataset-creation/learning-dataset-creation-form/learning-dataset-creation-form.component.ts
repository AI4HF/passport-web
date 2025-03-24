import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningDataset } from "../../../../../shared/models/learningDataset.model";
import { DatasetTransformation } from "../../../../../shared/models/datasetTransformation.model";
import { takeUntil, forkJoin } from "rxjs";
import { LearningDatasetAndTransformationRequest } from '../../../../../shared/models/learningDatasetAndTransformationRequest.model';

/**
 * Component for managing and displaying the form for creating or updating learning datasets and their transformations.
 */
@Component({
    selector: 'app-learning-dataset-creation-form',
    templateUrl: './learning-dataset-creation-form.component.html',
    styleUrls: ['./learning-dataset-creation-form.component.scss']
})
export class LearningDatasetCreationFormComponent extends BaseComponent implements OnInit {

    /** The ID of the dataset */
    @Input() datasetId: string;

    /** The ID of the learning dataset to be edited or created */
    @Input() learningDatasetId: string;

    /** The ID of the data transformation to be edited or created */
    @Input() dataTransformationId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the learning dataset and transformation */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** The learning dataset to be edited or created */
    learningDataset: LearningDataset;

    /** The transformation associated with the learning dataset */
    transformation: DatasetTransformation;

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
        this.display = true;
        if (this.learningDatasetId && this.dataTransformationId) {
            this.isUpdateMode = true;
            this.loadData();
        } else {
            this.learningDataset = new LearningDataset({ datasetId: this.datasetId });
            this.transformation = new DatasetTransformation({});
        }
    }

    /**
     * Initializes the form group with the learning dataset and transformation data.
     */
    initializeForm() {
        this.form = new FormGroup({
            transformationTitle: new FormControl('', Validators.required),
            transformationDescription: new FormControl('', Validators.required),
            learningDatasetDescription: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the learning dataset and transformation data.
     */
    loadData() {
        forkJoin({
            learningDataset: this.learningDatasetService.getLearningDatasetById(this.learningDatasetId, this.activeStudyService.getActiveStudy()),
            transformation: this.datasetTransformationService.getDatasetTransformationById(this.dataTransformationId, this.activeStudyService.getActiveStudy())
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: ({ learningDataset, transformation }) => {
                this.learningDataset = learningDataset;
                this.transformation = transformation;
                this.updateForm();
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
     * Updates the form with the loaded learning dataset and transformation details.
     */
    updateForm() {
        this.form.patchValue({
            transformationTitle: this.transformation.title,
            transformationDescription: this.transformation.description,
            learningDatasetDescription: this.learningDataset.description
        });
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

        if (this.isUpdateMode) {
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
        const request: LearningDatasetAndTransformationRequest = {
            datasetTransformation: new DatasetTransformation({ ...this.transformation, ...transformationPayload }),
            learningDataset: new LearningDataset({ ...this.learningDataset, ...learningDatasetPayload })
        };

        this.learningDatasetService.updateLearningDatasetWithTransformation(this.learningDataset.learningDatasetId, request, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.transformation = response.datasetTransformation;
                    this.learningDataset = response.learningDataset;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('DatasetManagement.Updated')
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

    /**
     * Creates a new transformation and the associated learning dataset.
     * @param transformationPayload The payload with the transformation data
     * @param learningDatasetPayload The payload with the learning dataset data
     */
    createTransformation(transformationPayload: any, learningDatasetPayload: any) {
        const request: LearningDatasetAndTransformationRequest = {
            datasetTransformation: new DatasetTransformation({ ...transformationPayload }),
            learningDataset: new LearningDataset({ ...learningDatasetPayload })
        };

        this.learningDatasetService.createLearningDatasetWithTransformation(request, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.transformation = response.datasetTransformation;
                    this.learningDataset = response.learningDataset;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('DatasetManagement.Created')
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

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
