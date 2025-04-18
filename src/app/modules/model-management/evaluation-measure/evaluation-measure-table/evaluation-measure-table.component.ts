import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import {EvaluationMeasure} from "../../../../shared/models/evaluationMeasure.model";

/**
 * Component for managing and displaying the EvaluationMeasure assignments.
 */
@Component({
    selector: 'app-evaluation-measure-table',
    templateUrl: './evaluation-measure-table.component.html',
    styleUrls: ['./evaluation-measure-table.component.scss']
})
export class EvaluationMeasureTableComponent extends BaseComponent implements OnInit {

    /** List of EvaluationMeasures */
    evaluationMeasures: EvaluationMeasure[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The IDs for the selected EvaluationMeasure for editing */
    selectedModelId: string;
    selectedEvaluationMeasureId: string;

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
            { field: 'name', header: 'EvaluationMeasure.Name' },
            { field: 'value', header: 'EvaluationMeasure.Value' },
            { field: 'dataType', header: 'EvaluationMeasure.DataType' },
            { field: 'description', header: 'EvaluationMeasure.Description' }
        ];

        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const modelId = params.get('modelId');
            this.selectedModelId = modelId;
            this.loadEvaluationMeasures(modelId);
        });
    }

    /**
     * Loads the EvaluationMeasures for the given Model ID.
     * @param modelId ID of the Model
     */
    loadEvaluationMeasures(modelId: string) {
        this.evaluationMeasureService.getEvaluationMeasuresByModelId(modelId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (evaluationMeasures: EvaluationMeasure[]) => {
                    this.evaluationMeasures = evaluationMeasures;
                    this.loading = false;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Deletes an EvaluationMeasure.
     * @param evaluationMeasure The EvaluationMeasure to be deleted
     */
    deleteEvaluationMeasure(evaluationMeasure: EvaluationMeasure) {
        this.evaluationMeasureService.deleteEvaluationMeasure(evaluationMeasure.measureId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.evaluationMeasures = this.evaluationMeasures.filter(evaluationMeasureElem => evaluationMeasureElem !== evaluationMeasure);
                    this.translateService.get(['Success', 'EvaluationMeasure.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['EvaluationMeasure.Deleted']
                        });
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
     * Displays the form for editing an EvaluationMeasure.
     * @param evaluationMeasure The EvaluationMeasure to be edited
     */
    showEvaluationMeasureForm(evaluationMeasure: EvaluationMeasure) {
        this.selectedEvaluationMeasureId = evaluationMeasure.measureId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new EvaluationMeasure.
     */
    createEvaluationMeasure() {
        this.selectedEvaluationMeasureId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadEvaluationMeasures(this.selectedModelId);
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
     * Navigates back to the model table.
     */
    returnToModels() {
        this.router.navigate([`/model-management`]);
    }
}
