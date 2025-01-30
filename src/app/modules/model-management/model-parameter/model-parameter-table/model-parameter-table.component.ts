import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { ModelParameter } from "../../../../shared/models/modelParameter.model";
import { Parameter } from "../../../../shared/models/parameter.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing and displaying the ModelParameter assignments.
 */
@Component({
    selector: 'app-model-parameter-table',
    templateUrl: './model-parameter-table.component.html',
    styleUrls: ['./model-parameter-table.component.scss']
})
export class ModelParameterTableComponent extends BaseComponent implements OnInit {

    /** List of ModelParameters */
    modelParameters: ModelParameter[] = [];

    /** Dictionary of parameters keyed by their ID */
    parameters: { [key: number]: Parameter } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The IDs for the selected ModelParameter for editing */
    selectedModelId: number;
    selectedParameterId: number;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

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
        this.columns = [
            { field: 'parameterTitle', header: 'ParameterAssignment.ParameterName' },
            { field: 'type', header: 'ParameterAssignment.Type' },
            { field: 'value', header: 'ParameterAssignment.Value' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const modelId = +params.get('id');
            this.selectedModelId = modelId;
            this.loadModelParameters(modelId);
        });
    }

    /**
     * Loads the ModelParameters for the given Model ID.
     * @param modelId ID of the Model
     */
    loadModelParameters(modelId: number) {
        this.modelParameterService.getModelParametersByModelId(modelId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (modelParameters: ModelParameter[]) => {
                    this.modelParameters = modelParameters;
                    this.loadParameters();
                    this.loading = false;
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Loads all Parameters and maps them to their IDs.
     */
    loadParameters() {
        this.parameterService.getAllParametersByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (parameters: Parameter[]) => {
                    parameters.forEach(param => this.parameters[param.parameterId] = param);
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
     * Deletes a ModelParameter.
     * @param modelParameter The ModelParameter to be deleted
     */
    deleteModelParameter(modelParameter: ModelParameter) {
        this.modelParameterService.deleteModelParameter(modelParameter.modelId, modelParameter.parameterId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modelParameters = this.modelParameters.filter(modelp => modelp !== modelParameter);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('ParameterAssignment.Deleted')
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
     * Displays the form for editing a ModelParameter.
     * @param modelParameter The ModelParameter to be edited
     */
    showModelParameterForm(modelParameter: ModelParameter) {
        this.selectedParameterId = modelParameter.parameterId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new ModelParameter.
     */
    createModelParameter() {
        this.selectedParameterId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadModelParameters(this.selectedModelId);
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
