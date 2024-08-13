import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningProcessParameter } from "../../../../../shared/models/learningProcessParameter.model";
import { Parameter } from "../../../../../shared/models/parameter.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing the form to create or update LearningProcessParameter assignments.
 */
@Component({
    selector: 'app-learning-process-parameter-assignment-form',
    templateUrl: './learning-process-parameter-assignment-form.component.html',
    styleUrls: ['./learning-process-parameter-assignment-form.component.scss']
})
export class LearningProcessParameterAssignmentFormComponent extends BaseComponent implements OnInit {

    /** The ID of the LearningProcess */
    @Input() learningProcessId: number;

    /** The LearningProcessParameter to be edited or created */
    @Input() learningProcessParameter: LearningProcessParameter;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the LearningProcessParameter */
    form: FormGroup;

    /** List of parameters */
    parameters: Parameter[] = [];

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
        this.loadParameters();
        this.display = true;

        if (this.learningProcessParameter) {
            this.updateForm();
        }
    }

    /**
     * Initializes the form group with the LearningProcessParameter data.
     */
    initializeForm() {
        this.form = new FormGroup({
            parameterId: new FormControl(null, Validators.required),
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads all available Parameters for the dropdown.
     */
    loadParameters() {
        this.parameterService.getAllParameters().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: parameters => {
                    this.parameters = parameters;
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
     * Updates the form with the LearningProcessParameter data.
     */
    updateForm() {
        this.form.patchValue({
            parameterId: this.learningProcessParameter.parameterId,
            type: this.learningProcessParameter.type,
            value: this.learningProcessParameter.value
        });
    }

    /**
     * Saves the LearningProcessParameter, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningProcessParameterPayload = {
            learningProcessId: this.learningProcessId,
            parameterId: formValues.parameterId,
            type: formValues.type,
            value: formValues.value
        };

        if (this.learningProcessParameter) {
            this.updateLearningProcessParameter(learningProcessParameterPayload);
        } else {
            this.createLearningProcessParameter(learningProcessParameterPayload);
        }
    }

    /**
     * Creates a new LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be created
     */
    createLearningProcessParameter(learningProcessParameter: LearningProcessParameter) {
        this.learningProcessParameterService.createLearningProcessParameter(learningProcessParameter)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('Created')
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
     * Updates an existing LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be updated
     */
    updateLearningProcessParameter(learningProcessParameter: LearningProcessParameter) {
        this.learningProcessParameterService.updateLearningProcessParameter(
            learningProcessParameter
        ).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('Updated')
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