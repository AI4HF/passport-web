import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningProcessParameter } from "../../../../../shared/models/learningProcessParameter.model";
import { Parameter } from "../../../../../shared/models/parameter.model";
import { takeUntil, switchMap } from "rxjs";

/**
 * Component for managing the form to create or update LearningProcessParameter assignments.
 */
@Component({
    selector: 'app-lp-parameter-form',
    templateUrl: './learning-process-parameter-form.component.html',
    styleUrls: ['./learning-process-parameter-form.component.scss']
})
export class LearningProcessParameterFormComponent extends BaseComponent implements OnInit {

    /** The ID of the LearningProcess */
    @Input() learningProcessId: number;

    /** The ID of the Parameter to be edited or created */
    @Input() parameterId: number;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the LearningProcessParameter */
    form: FormGroup;

    /** List of parameters */
    parameters: Parameter[] = [];

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The current LearningProcessParameter being edited */
    learningProcessParameter: LearningProcessParameter;

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

        if (this.parameterId) {
            this.loadLearningProcessParameter();
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
     * Loads the selected LearningProcessParameter using the provided IDs.
     */
    loadLearningProcessParameter() {
        this.learningProcessParameterService.getLearningProcessParameterById(this.learningProcessId, this.parameterId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessParameter => {
                    this.learningProcessParameter = learningProcessParameter;
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
     * Updates the form with the LearningProcessParameter data.
     */
    updateForm() {
        if (this.learningProcessParameter) {
            const selectedParameter = this.parameters.find(
                param => param.parameterId === this.learningProcessParameter.parameterId
            );

            this.form.patchValue({
                parameterId: selectedParameter || null,
                type: this.learningProcessParameter.type,
                value: this.learningProcessParameter.value
            });
        }
    }

    /**
     * Saves the LearningProcessParameter, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningProcessParameterPayload = {
            learningProcessId: this.learningProcessId,
            parameterId: formValues.parameterId.parameterId,
            type: formValues.type,
            value: formValues.value
        };

        if (this.parameterId) {
            // Update existing Learning Process Parameter
            this.updateLearningProcessParameter(learningProcessParameterPayload);
        } else {
            // Create new Learning Process Parameter
            this.createLearningProcessParameter(learningProcessParameterPayload);
        }
    }
    /**
     * Creates a new LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be created
     */
    createLearningProcessParameter(learningProcessParameter: any) {
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
    updateLearningProcessParameter(learningProcessParameter: any) {
        this.learningProcessParameterService.updateLearningProcessParameter(learningProcessParameter)
            .pipe(takeUntil(this.destroy$))
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
