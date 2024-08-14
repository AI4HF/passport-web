import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningProcessDataset } from '../../../../../shared/models/learningProcessDataset.model';
import { LearningDataset } from '../../../../../shared/models/learningDataset.model';
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
    @Input() learningProcessId: number;

    /** The ID of the learning dataset */
    @Input() learningDatasetId: number;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the learning process dataset */
    form: FormGroup;

    /** List of learning datasets */
    learningDatasets: LearningDataset[] = [];

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** The current learning process dataset being edited */
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
        this.loadLearningDatasets();

        if (this.learningDatasetId) {
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
            learningDataset: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the learning datasets to populate the dropdown.
     */
    loadLearningDatasets() {
        this.learningDatasetService.getAllLearningDatasets().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => this.learningDatasets = datasets,
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
     * Loads the learning process dataset details using the provided IDs.
     */
    loadLearningProcessDataset() {
        this.learningProcessDatasetService.getLearningProcessDatasetById(this.learningProcessId, this.learningDatasetId)
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
        console.log(this.learningDatasets);
        const selectedLearningDataset = this.learningDatasets.find(
            (dataset) => dataset.learningDatasetId === this.learningDatasetId
        );
        console.log(this.learningProcessDataset);
        this.form.patchValue({
            learningDataset: selectedLearningDataset || null,
            description: this.learningProcessDataset.description
        });
        console.log(this.form.value);
    }

    /**
     * Saves the learning process dataset, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningProcessDatasetPayload = {
            learningProcessId: this.learningProcessId,
            learningDatasetId: formValues.learningDataset.learningDatasetId,
            description: formValues.description
        };

        if (this.isUpdateMode) {
            const updatedLearningProcessDataset: LearningProcessDataset = new LearningProcessDataset({
                ...learningProcessDatasetPayload,
                learningDatasetId: this.learningDatasetId
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
        } else {
            const newLearningProcessDataset: LearningProcessDataset = new LearningProcessDataset(learningProcessDatasetPayload);

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
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
