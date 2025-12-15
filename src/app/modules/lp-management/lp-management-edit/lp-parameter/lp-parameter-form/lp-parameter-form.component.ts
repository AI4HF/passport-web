import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LearningProcessParameter } from "../../../../../shared/models/learningProcessParameter.model";
import { Parameter } from "../../../../../shared/models/parameter.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing the form to create or update LearningProcessParameter assignments.
 */
@Component({
    selector: 'app-lp-parameter-form',
    templateUrl: './lp-parameter-form.component.html',
    styleUrls: ['./lp-parameter-form.component.scss']
})
export class LpParameterFormComponent extends BaseComponent implements OnInit {

    /** The ID of the LearningProcess */
    @Input() learningProcessId: string;

    /** The ID of the Parameter to be edited or created */
    @Input() parameterId: string;

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
        this.isUpdateMode = !!this.parameterId;
        this.initializeForm();
        this.display = true;

        if (this.isUpdateMode) {
            this.loadParameterById();
        } else {
            this.learningProcessParameter = new LearningProcessParameter({ learningProcessId: this.learningProcessId });
            this.loadParameters();
        }
    }

    /**
     * Initializes the form group with the LearningProcessParameter data.
     */
    initializeForm() {
        this.form = new FormGroup({
            parameterId: new FormControl({ value: '', disabled: false }, this.isUpdateMode ? [] : Validators.required),
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads all available Parameters for the dropdown.
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
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
    }

    /**
     * Filters the parameters to remove those that are already associated with the learning process.
     * If the filtered list is empty, closes the form and shows an error message.
     */
    filterAvailableParameters() {
        this.learningProcessParameterService.getLearningProcessParametersByProcessId(this.learningProcessId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessParameters => {
                    const usedParameterIds = learningProcessParameters.map(param => param.parameterId);
                    this.parameters = this.parameters.filter(param => !usedParameterIds.includes(param.parameterId));

                    if (this.parameters.length === 0) {
                        this.translateService.get(['Error', 'ParameterAssignment.NoAvailableParameters']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translations['Error'],
                                detail: translations['ParameterAssignment.NoAvailableParameters']
                            });
                        });
                        this.closeDialog();
                    }
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
    }

    /**
     * Loads the selected LearningProcessParameter using the provided IDs.
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
                    this.updateForm();
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
    }

    /**
     * Updates the form with the loaded parameter assignment details.
     */
    updateForm() {
        this.learningProcessParameterService.getLearningProcessParameterById(this.learningProcessId, this.parameterId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessParameter => {
                    this.form.patchValue({
                        type: learningProcessParameter.type,
                        value: learningProcessParameter.value
                    });
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
    }

    /**
     * Saves the LearningProcessParameter, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningProcessParameterPayload = new LearningProcessParameter({
            learningProcessId: this.learningProcessId,
            parameterId: this.isUpdateMode ? this.parameterId : formValues.parameterId.parameterId,
            type: formValues.type,
            value: formValues.value
        });

        if (this.isUpdateMode) {
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
        this.learningProcessParameterService.createLearningProcessParameter(learningProcessParameter, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'ParameterAssignment.Updated']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['ParameterAssignment.Updated']
                        });
                    });
                    this.closeDialog();
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
    }

    /**
     * Updates an existing LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be updated
     */
    updateLearningProcessParameter(learningProcessParameter: LearningProcessParameter) {
        this.learningProcessParameterService.updateLearningProcessParameter(learningProcessParameter, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'ParameterAssignment.Created']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['ParameterAssignment.Created']
                        });
                    });
                    this.closeDialog();
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
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
