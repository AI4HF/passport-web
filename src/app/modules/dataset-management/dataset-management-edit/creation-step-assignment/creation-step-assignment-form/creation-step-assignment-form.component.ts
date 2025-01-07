import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatasetTransformationStep } from "../../../../../shared/models/datasetTransformationStep.model";
import { DatasetTransformation } from "../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing and displaying the form for dataset transformation steps.
 */
@Component({
    selector: 'app-creation-step-assignment-form',
    templateUrl: './creation-step-assignment-form.component.html',
    styleUrls: ['./creation-step-assignment-form.component.scss']
})
export class CreationStepAssignmentFormComponent extends BaseComponent implements OnInit {

    /** The ID of the data transformation */
    @Input() dataTransformationId: number;

    /** The transformation step to be edited or created */
    @Input() transformationStep: DatasetTransformationStep;

    /** The transformation associated with the transformation step */
    @Input() transformation: DatasetTransformation;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the transformation step */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

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
        if (this.transformationStep) {
            this.isUpdateMode = true;
            this.updateForm();
        } else {
            this.transformationStep = new DatasetTransformationStep({ dataTransformationId: this.dataTransformationId });
        }
    }

    /**
     * Initializes the form group with the transformation step data.
     */
    initializeForm() {
        this.form = new FormGroup({
            inputFeatures: new FormControl(this.transformationStep?.inputFeatures || '', Validators.required),
            outputFeatures: new FormControl(this.transformationStep?.outputFeatures || '', Validators.required),
            method: new FormControl(this.transformationStep?.method || '', Validators.required),
            explanation: new FormControl(this.transformationStep?.explanation || '', Validators.required)
        });
    }

    /**
     * Updates the form with the loaded transformation step details.
     */
    updateForm() {
        this.form.patchValue({
            inputFeatures: this.transformationStep.inputFeatures,
            outputFeatures: this.transformationStep.outputFeatures,
            method: this.transformationStep.method,
            explanation: this.transformationStep.explanation
        });
    }

    /**
     * Saves the transformation step, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const transformationStepPayload = {
            dataTransformationId: this.dataTransformationId,
            inputFeatures: formValues.inputFeatures,
            outputFeatures: formValues.outputFeatures,
            method: formValues.method,
            explanation: formValues.explanation
        };

        if (this.isUpdateMode) {
            this.updateTransformationStep(transformationStepPayload);
        } else {
            this.createTransformationStep(transformationStepPayload);
        }
    }

    /**
     * Updates an existing transformation step.
     * @param transformationStepPayload The payload with the transformation step data
     */
    updateTransformationStep(transformationStepPayload: any) {
        this.transformationStepService.updateDatasetTransformationStep({
            ...this.transformationStep,
            ...transformationStepPayload
        }, this.activeStudyService.getActiveStudy()).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: step => {
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
     * Creates a new transformation step.
     * @param transformationStepPayload The payload with the transformation step data
     */
    createTransformationStep(transformationStepPayload: any) {
        this.transformationStepService.createDatasetTransformationStep(transformationStepPayload, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: step => {
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

