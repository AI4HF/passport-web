import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModelParameter } from "../../../../shared/models/modelParameter.model";
import { Parameter } from "../../../../shared/models/parameter.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing the form to create or update ModelParameter assignments.
 */
@Component({
    selector: 'app-model-parameter-form',
    templateUrl: './model-parameter-form.component.html',
    styleUrls: ['./model-parameter-form.component.scss']
})
export class ModelParameterFormComponent extends BaseComponent implements OnInit {

    /** The ID of the Model */
    @Input() modelId: string;

    /** The ID of the Parameter to be edited or created */
    @Input() parameterId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the ModelParameter */
    form: FormGroup;

    /** List of parameters */
    parameters: Parameter[] = [];

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The current ModelParameter being edited */
    modelParameter: ModelParameter;

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
            this.modelParameter = new ModelParameter({ modelId: this.modelId });
            this.loadParameters();
        }
    }

    /**
     * Initializes the form group with the ModelParameter data.
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
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Filters the parameters to remove those that are already associated with the learning process.
     * If the filtered list is empty, closes the form and shows an error message.
     */
    filterAvailableParameters() {
        this.modelParameterService.getModelParametersByModelId(this.modelId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: modelParameters => {
                    const usedParameterIds = modelParameters.map(param => param.parameterId);
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
     * Loads the selected ModelParameter using the provided IDs.
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
        this.modelParameterService.getModelParameterById(this.modelId, this.parameterId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: modelParameter => {
                    this.form.patchValue({
                        type: modelParameter.type,
                        value: modelParameter.value
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
     * Saves the ModelParameter, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const modelParameterPayload = new ModelParameter({
            modelId: this.modelId,
            parameterId: this.isUpdateMode ? this.parameterId : formValues.parameterId.parameterId,
            type: formValues.type,
            value: formValues.value
        });

        if (this.isUpdateMode) {
            this.updateModelParameter(modelParameterPayload);
        } else {
            this.createModelParameter(modelParameterPayload);
        }
    }

    /**
     * Creates a new ModelParameter.
     * @param modelParameter The ModelParameter to be created
     */
    createModelParameter(modelParameter: ModelParameter) {
        this.modelParameterService.createModelParameter(modelParameter, this.activeStudyService.getActiveStudy())
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

    /**
     * Updates an existing ModelParameter.
     * @param modelParameter The ModelParameter to be updated
     */
    updateModelParameter(modelParameter: ModelParameter) {
        this.modelParameterService.updateModelParameter(modelParameter, this.activeStudyService.getActiveStudy())
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
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
