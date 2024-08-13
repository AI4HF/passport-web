import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningProcessDataset } from '../../../../../../shared/models/learningProcessDataset.model';
import { Dataset } from '../../../../../../shared/models/dataset.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing and displaying the form for creating or updating learning process datasets.
 */
@Component({
    selector: 'app-learning-process-dataset-assignment-form',
    templateUrl: './learning-process-dataset-assignment-form.component.html',
    styleUrls: ['./learning-process-dataset-assignment-form.component.scss']
})
export class LearningProcessDatasetAssignmentFormComponent extends BaseComponent implements OnInit {

    /** The ID of the learning process */
    @Input() learningProcessId: string;

    /** The ID of the learning process dataset to be edited or created */
    @Input() learningProcessDatasetId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the learning process dataset */
    form: FormGroup;

    /** List of datasets */
    datasets: Dataset[] = [];

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** The learning process dataset to be edited or created */
    learningProcessDataset: LearningProcessDataset;

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
        this.loadDatasets();
        if (this.learningProcessDatasetId) {
            this.isUpdateMode = true;
            this.loadLearningProcessDataset();
        } else {
            this.learningProcessDataset = new LearningProcessDataset({ learningProcessId: this.learningProcessId });
        }
    }

    /**
     * Initializes the form group with the learning process dataset data.
     */
    initializeForm() {
        this.form = new FormGroup({
            datasetId: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the datasets to populate the dropdown.
     */
    loadDatasets() {
        this.datasetService.getAllDatasets().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => this.datasets = datasets,
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
     * Loads the learning process dataset data if in update mode.
     */
    loadLearningProcessDataset() {
        this.learningProcessDatasetService.getLearningProcessDatasetById(this.learningProcessId, this.learningProcessDatasetId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessDataset => {
                    this.learningProcessDataset = learningProcessDataset;
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
     * Updates the form with the loaded learning process dataset details.
     */
    updateForm() {
        this.form.patchValue({
            datasetId: this.learningProcessDataset.learningDatasetId,
            description: this.learningProcessDataset.description
        });
    }

    /**
     * Saves the learning process dataset, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningProcessDatasetPayload = {
            learningProcessId: this.learningProcessId,
            learningDatasetId: formValues.datasetId,
            description: formValues.description
        };

        if (this.isUpdateMode) {
            this.updateLearningProcessDataset(learningProcessDatasetPayload);
        } else {
            this.createLearningProcessDataset(learningProcessDatasetPayload);
        }
    }

    /**
     * Updates an existing learning process dataset.
     * @param learningProcessDatasetPayload The payload with the learning process dataset data
     */
    updateLearningProcessDataset(learningProcessDatasetPayload: any) {
        const updatedLearningProcessDataset: LearningProcessDataset = new LearningProcessDataset({
            learningProcessId: this.learningProcessDataset.learningProcessId,
            learningDatasetId: learningProcessDatasetPayload.learningDatasetId,
            description: learningProcessDatasetPayload.description
        });

        this.learningProcessDatasetService.updateLearningProcessDataset(updatedLearningProcessDataset)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningProcessManagement.Updated')
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
     * Creates a new learning process dataset.
     * @param learningProcessDatasetPayload The payload with the learning process dataset data
     */
    createLearningProcessDataset(learningProcessDatasetPayload: any) {
        const newLearningProcessDataset: LearningProcessDataset = new LearningProcessDataset({
            learningProcessId: learningProcessDatasetPayload.learningProcessId,
            learningDatasetId: learningProcessDatasetPayload.learningDatasetId,
            description: learningProcessDatasetPayload.description
        });

        this.learningProcessDatasetService.createLearningProcessDataset(newLearningProcessDataset)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('LearningProcessManagement.Created')
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
