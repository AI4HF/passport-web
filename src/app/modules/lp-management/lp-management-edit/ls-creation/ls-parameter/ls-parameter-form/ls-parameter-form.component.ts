import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningStageParameter } from '../../../../../../shared/models/learningStageParameter.model';
import { Parameter } from '../../../../../../shared/models/parameter.model';
import { takeUntil } from 'rxjs';

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
    @Input() learningStageId: string;

    /** The ID of the parameter assignment to be edited or created */
    @Input() parameterId: string;

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
        this.isUpdateMode = !!this.parameterId;
        this.initializeForm();
        this.display = true;

        if (this.isUpdateMode) {
            this.loadParameterById();
        } else {
            this.parameterAssignment = new LearningStageParameter({ learningStageId: this.learningStageId });
            this.loadParameters();
        }
    }

    /**
     * Initializes the form group with the parameter assignment data.
     */
    initializeForm() {
        this.form = new FormGroup({
            parameterId: new FormControl({ value: '', disabled: false }, this.isUpdateMode ? [] : Validators.required),
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads all available parameters for the dropdown.
     * Only executed when creating a new entry, not during updates.
     */
    loadParameters() {
        this.parameterService.getAllParametersByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: parameters => {
                    this.parameters = parameters;
                    this.filterAvailableParameters();
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
     * Filters the parameters to remove those that are already associated with the learning stage.
     * If the filtered list is empty, closes the form and shows an error message.
     */
    filterAvailableParameters() {
        this.learningStageParameterService.getLearningStageParametersByStageId(this.learningStageId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningStageParameters => {
                    const usedParameterIds = learningStageParameters.map(param => param.parameterId);
                    this.parameters = this.parameters.filter(param => !usedParameterIds.includes(param.parameterId));

                    if (this.parameters.length === 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: this.translateService.instant('ParameterAssignment.NoAvailableParameters')
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
     * Loads the parameter assignment data if editing.
     */
    loadParameterById() {
        this.parameterService.getParameterById(this.parameterId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: parameter => {
                    this.parameters = [parameter];
                    this.form.patchValue({
                        parameterId: parameter
                    });
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        this.updateForm();
    }

    /**
     * Updates the form with the loaded parameter assignment details.
     */
    updateForm() {
        this.learningStageParameterService.getLearningStageParameterById(this.learningStageId, this.parameterId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningStageParameter => {
                    this.form.patchValue({
                        type: learningStageParameter.type,
                        value: learningStageParameter.value
                    });
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
            parameterId: this.isUpdateMode ? this.parameterId : formValues.parameterId.parameterId,
            type: formValues.type,
            value: formValues.value
        });

        if (this.isUpdateMode) {
            this.learningStageParameterService.updateLearningStageParameter(payload, this.activeStudyService.getActiveStudy())
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
            this.learningStageParameterService.createLearningStageParameter(payload, this.activeStudyService.getActiveStudy())
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

