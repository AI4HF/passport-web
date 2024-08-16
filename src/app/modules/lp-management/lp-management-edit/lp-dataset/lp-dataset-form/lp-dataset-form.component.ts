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
    templateUrl: './lp-dataset-form.component.html',
    styleUrls: ['./lp-dataset-form.component.scss']
})
export class LpDatasetFormComponent extends BaseComponent implements OnInit {

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
        this.isUpdateMode = !!this.learningDatasetId;
        this.initializeForm();
        this.display = true;

        if (this.isUpdateMode) {
            this.loadLearningProcessDataset();
        } else {
            this.learningProcessDataset = new LearningProcessDataset({ learningProcessId: this.learningProcessId });
            this.loadLearningDatasets(); // Only load datasets if not in update mode
        }
    }

    /**
     * Initializes the form group with the learning process dataset data.
     */
    initializeForm() {
        this.form = new FormGroup({
            learningDataset: new FormControl({ value: '', disabled: this.isUpdateMode }, this.isUpdateMode ? [] : Validators.required),
            description: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the learning datasets to populate the dropdown.
     * Only executed when creating a new entry, not during updates.
     */
    loadLearningDatasets() {
        this.learningDatasetService.getAllLearningDatasets().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => {
                    this.learningDatasets = datasets;
                    this.filterAvailableDatasets();
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
     * Filters the learning datasets to remove those that are already associated with the learning process.
     * If the filtered list is empty, closes the form and shows an error message.
     */
    filterAvailableDatasets() {
        this.learningProcessDatasetService.getLearningProcessDatasetsByLearningProcessId(this.learningProcessId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessDatasets => {
                    const usedDatasetIds = learningProcessDatasets.map(dataset => dataset.learningDatasetId);
                    this.learningDatasets = this.learningDatasets.filter(dataset => !usedDatasetIds.includes(dataset.learningDatasetId));

                    if (this.learningDatasets.length === 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: this.translateService.instant('LearningProcessManagement.NoAvailableDatasets')
                        });
                        this.closeDialog();
                    }
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
     * Only the description field is updated; the learning dataset is not modified.
     */
    updateForm() {
        this.form.patchValue({
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
            learningDatasetId: this.isUpdateMode ? this.learningDatasetId : formValues.learningDataset.learningDatasetId,
            description: formValues.description
        };

        if (this.isUpdateMode) {
            const updatedLearningProcessDataset: LearningProcessDataset = new LearningProcessDataset({
                ...learningProcessDatasetPayload
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
