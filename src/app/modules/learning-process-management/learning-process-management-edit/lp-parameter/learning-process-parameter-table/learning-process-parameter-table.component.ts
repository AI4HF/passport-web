import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { LearningProcessParameter } from "../../../../../shared/models/learningProcessParameter.model";
import { Parameter } from "../../../../../shared/models/parameter.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing and displaying the LearningProcessParameter assignments.
 */
@Component({
    selector: 'app-lp-parameter-table',
    templateUrl: './learning-process-parameter-table.component.html',
    styleUrls: ['./learning-process-parameter-table.component.scss']
})
export class LearningProcessParameterTableComponent extends BaseComponent implements OnInit {

    /** List of LearningProcessParameters */
    learningProcessParameters: LearningProcessParameter[] = [];

    /** Dictionary of parameters keyed by their ID */
    parameters: { [key: number]: Parameter } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The IDs for the selected LearningProcessParameter for editing */
    selectedLearningProcessId: number;
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
            const learningProcessId = +params.get('id');
            this.selectedLearningProcessId = learningProcessId;
            this.loadLearningProcessParameters(learningProcessId);
        });
    }

    /**
     * Loads the LearningProcessParameters for the given LearningProcess ID.
     * @param learningProcessId ID of the LearningProcess
     */
    loadLearningProcessParameters(learningProcessId: number) {
        this.learningProcessParameterService.getLearningProcessParametersByProcessId(learningProcessId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (learningProcessParameters: LearningProcessParameter[]) => {
                    this.learningProcessParameters = learningProcessParameters;
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
        this.parameterService.getAllParameters().pipe(takeUntil(this.destroy$))
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
     * Deletes a LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be deleted
     */
    deleteLearningProcessParameter(learningProcessParameter: LearningProcessParameter) {
        this.learningProcessParameterService.deleteLearningProcessParameter(learningProcessParameter.learningProcessId, learningProcessParameter.parameterId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningProcessParameters = this.learningProcessParameters.filter(lpp => lpp !== learningProcessParameter);
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
     * Displays the form for editing a LearningProcessParameter.
     * @param learningProcessParameter The LearningProcessParameter to be edited
     */
    showLearningProcessParameterForm(learningProcessParameter: LearningProcessParameter) {
        this.selectedParameterId = learningProcessParameter.parameterId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new LearningProcessParameter.
     */
    createLearningProcessParameter() {
        this.selectedParameterId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadLearningProcessParameters(this.selectedLearningProcessId);
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
