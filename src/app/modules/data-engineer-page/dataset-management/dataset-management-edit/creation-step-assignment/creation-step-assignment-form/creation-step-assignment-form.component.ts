import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatasetTransformationStep } from "../../../../../../shared/models/datasetTransformationStep.model";
import { DatasetTransformation } from "../../../../../../shared/models/datasetTransformation.model";
import { takeUntil } from "rxjs";

@Component({
    selector: 'app-creation-step-assignment-form',
    templateUrl: './creation-step-assignment-form.component.html',
    styleUrls: ['./creation-step-assignment-form.component.scss']
})
export class CreationStepAssignmentFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() dataTransformationId: number;
    @Input() transformationStep: DatasetTransformationStep;
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
        if (changes['transformationStep'] || changes['transformation']) {
            this.initializeForm();
        }
    }

    initializeForm() {
        this.form = new FormGroup({
            inputFeatures: new FormControl(this.transformationStep?.inputFeatures || '', Validators.required),
            outputFeatures: new FormControl(this.transformationStep?.outputFeatures || '', Validators.required),
            method: new FormControl(this.transformationStep?.method || '', Validators.required),
            explanation: new FormControl(this.transformationStep?.explanation || '', Validators.required)
        });
        this.display = true;
    }

    save() {
        const formValues = this.form.value;

        const transformationStepPayload = {
            dataTransformationId: this.dataTransformationId,
            inputFeatures: formValues.inputFeatures,
            outputFeatures: formValues.outputFeatures,
            method: formValues.method,
            explanation: formValues.explanation
        };

        if (this.transformationStep && this.transformationStep.stepId) {
            this.updateTransformationStep(transformationStepPayload);
        } else {
            this.createTransformationStep(transformationStepPayload);
        }
    }

    updateTransformationStep(transformationStepPayload: any) {
        this.transformationStepService.updateDatasetTransformationStep({
            ...this.transformationStep,
            ...transformationStepPayload
        }).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: step => {
                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('Success'),
                    detail: this.translateService.instant('Transformation Step Updated')
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

    createTransformationStep(transformationStepPayload: any) {
        this.transformationStepService.createDatasetTransformationStep(transformationStepPayload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: step => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('Transformation Step Created')
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

    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
