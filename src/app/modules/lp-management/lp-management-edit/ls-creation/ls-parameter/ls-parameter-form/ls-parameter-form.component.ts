import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningStageParameter } from '../../../../../../shared/models/learningStageParameter.model';
import { Parameter } from '../../../../../../shared/models/parameter.model';
import { takeUntil, forkJoin } from 'rxjs';

/**
 * Component for managing and displaying the form for creating or updating learning stage parameter assignments.
 */
@Component({
    selector: 'app-learning-stage-parameter-assignment-form',
    templateUrl: './ls-parameter-form.component.html',
    styleUrls: ['./ls-parameter-form.component.scss']
})
export class LsParameterFormComponent extends BaseComponent implements OnInit {

    /** The ID of the learning stage */
    @Input() learningStageId: number;

    /** The ID of the parameter assignment to be edited or created */
    @Input() parameterId: number;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the parameter assignment */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** The parameter assignment to be edited or created */
    parameterAssignment: LearningStageParameter;

    /** The list of all parameters */
    parameters: Parameter[] = [];

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
        this.loadParameters();
        this.initializeForm();
        this.display = true;
        if (this.parameterId) {
            this.isUpdateMode = true;
            this.loadData();
        } else {
            this.parameterAssignment = new LearningStageParameter({ learningStageId: this.learningStageId });
        }
    }

    /**
     * Initializes the form group with the parameter assignment data.
     */
    initializeForm() {
        this.form = new FormGroup({
            parameterId: new FormControl(null, Validators.required),
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the parameter assignment data if editing.
     */
    loadData() {
        this.learningStageParameterService.getLearningStageParameterById(this.learningStageId, this.parameterId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: assignment => {
                    this.parameterAssignment = assignment;
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
     * Updates the form with the loaded parameter assignment details.
     */
    updateForm() {
        if (this.parameterAssignment) {
            const selectedParameter = this.parameters.find(
                param => param.parameterId === this.parameterAssignment.parameterId
            );
            this.form.patchValue({
                parameterId: selectedParameter || null,
                type: this.parameterAssignment.type,
                value: this.parameterAssignment.value
            });
        }
    }

    /**
     * Loads all available parameters for the dropdown.
     */
    loadParameters() {
        this.parameterService.getAllParameters()
            .pipe(takeUntil(this.destroy$))
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
     * Saves the parameter assignment, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const payload = new LearningStageParameter({
            learningStageId: this.learningStageId,
            parameterId: formValues.parameterId.parameterId,
            type: formValues.type,
            value: formValues.value
        });

        if (this.isUpdateMode) {
            this.learningStageParameterService.updateLearningStageParameter(payload)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('ParameterAssignment.Updated')
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
            this.learningStageParameterService.createLearningStageParameter(payload)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('ParameterAssignment.Created')
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
