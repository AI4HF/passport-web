import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { LearningStageParameter } from '../../../../../../shared/models/learningStageParameter.model';
import { Parameter } from '../../../../../../shared/models/parameter.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing and displaying the learning stage parameter assignments table.
 */
@Component({
    selector: 'app-learning-stage-parameter-assignment-table',
    templateUrl: './ls-parameter-table.component.html',
    styleUrls: ['./ls-parameter-table.component.scss']
})
export class LsParameterTableComponent extends BaseComponent implements OnInit {

    /** List of parameter assignments */
    parameterAssignments: LearningStageParameter[] = [];

    /** Dictionary of parameters keyed by their ID */
    parameters: { [key: number]: Parameter } = {};

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The learning stage ID from the route */
    learningStageId: number;

    /** The learning process ID from the route */
    learningProcessId: number;

    /** The parameter ID selected for editing */
    selectedParameterId: number = null;

    /** The columns to display in the table */
    columns: any[];

    /** Loading state of the table */
    loading: boolean = true;

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
            { field: 'parameterName', header: 'Parameter Name' },
            { field: 'type', header: 'Type' },
            { field: 'value', header: 'Value' }
        ];

        this.route.parent.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.learningProcessId = +params.get('id');
        });

        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.learningStageId = +params.get('learningStageId');
            this.loadParameterAssignments();
        });
    }

    /**
     * Loads the parameter assignments for the learning stage.
     */
    loadParameterAssignments() {
        this.learningStageParameterService.getLearningStageParametersByStageId(+this.learningStageId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: parameterAssignments => {
                    this.parameterAssignments = parameterAssignments;
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
     * Loads the parameters associated with the assignments.
     */
    loadParameters() {
        this.parameterService.getAllParameters().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: parameters => {
                    parameters.forEach(param => this.parameters[param.parameterId] = param);
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
     * Deletes a parameter assignment by its ID.
     * @param assignment The parameter assignment to be deleted
     */
    deleteParameterAssignment(assignment: LearningStageParameter) {
        this.learningStageParameterService.deleteLearningStageParameter(assignment.learningStageId, assignment.parameterId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.parameterAssignments = this.parameterAssignments.filter(a => a.parameterId !== assignment.parameterId);
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
     * Displays the form for editing a parameter assignment.
     * @param parameter The parameter assignment to be edited
     */
    showParameterAssignmentForm(parameter: LearningStageParameter) {
        this.selectedParameterId = parameter.parameterId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new parameter assignment.
     */
    createParameterAssignment() {
        this.selectedParameterId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadParameterAssignments();
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates back to the learning stage creation table.
     */
    returnToLearningStages() {
        this.router.navigate([`/learning-process-management/${this.learningProcessId}/learning-stage-management`]);
    }
}
