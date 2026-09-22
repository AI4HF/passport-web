import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { forkJoin, of, takeUntil } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ModelEvaluation } from "../../../../shared/models/modelEvaluation.model";
import { EvaluationMeasure } from "../../../../shared/models/evaluationMeasure.model";

/**
 * Component listing the evaluation runs of a Model, each expanding to the measures it produced.
 */
@Component({
    selector: 'app-model-evaluation-table',
    templateUrl: './model-evaluation-table.component.html',
    styleUrls: ['./model-evaluation-table.component.scss']
})
export class ModelEvaluationTableComponent extends BaseComponent implements OnInit {

    /** The evaluation runs of the Model */
    modelEvaluations: ModelEvaluation[] = [];

    /** The measures of each run, keyed by run id */
    measuresByEvaluation: { [modelEvaluationId: string]: EvaluationMeasure[] } = {};

    /** The ID of the Model whose runs are shown */
    selectedModelId: string;

    /** Whether the evaluation run form is displayed */
    displayEvaluationForm: boolean = false;

    /** The ID of the evaluation run being edited */
    selectedModelEvaluationId: string;

    /** Whether the measure form is displayed */
    displayMeasureForm: boolean = false;

    /** The run the measure being edited belongs to */
    measureFormEvaluationId: string;

    /** The ID of the measure being edited */
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
            { field: 'trigger', header: 'ModelEvaluation.Trigger' },
            { field: 'aggregationMethod', header: 'ModelEvaluation.AggregationMethod' },
            { field: 'executedAt', header: 'ModelEvaluation.ExecutedAt' },
            { field: 'executedBy', header: 'ModelEvaluation.ExecutedBy' },
            { field: 'description', header: 'ModelEvaluation.Description' }
        ];

        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.selectedModelId = params.get('modelId');
            this.loadModelEvaluations();
        });
    }

    /**
     * Loads the evaluation runs of the Model together with their measures.
     */
    loadModelEvaluations() {
        const studyId = this.activeStudyService.getActiveStudy();
        this.loading = true;
        this.modelEvaluationService.getModelEvaluationsByModelId(this.selectedModelId, studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (modelEvaluations: ModelEvaluation[]) => {
                    this.modelEvaluations = modelEvaluations;
                    this.measuresByEvaluation = {};

                    if (!modelEvaluations.length) {
                        this.loading = false;
                        return;
                    }

                    forkJoin(modelEvaluations.map(modelEvaluation =>
                        this.evaluationMeasureService
                            .getEvaluationMeasuresByModelEvaluationId(modelEvaluation.modelEvaluationId, studyId)
                            .pipe(
                                map(measures => ({ modelEvaluation, measures })),
                                catchError(() => of({ modelEvaluation, measures: [] as EvaluationMeasure[] }))
                            )
                    )).pipe(takeUntil(this.destroy$)).subscribe(results => {
                        results.forEach(result => {
                            this.measuresByEvaluation[result.modelEvaluation.modelEvaluationId] = result.measures;
                        });
                        this.loading = false;
                    });
                },
                error: error => {
                    this.showError(error);
                    this.loading = false;
                }
            });
    }

    /**
     * Returns the measures of an evaluation run.
     * @param modelEvaluation The evaluation run
     */
    measuresOf(modelEvaluation: ModelEvaluation): EvaluationMeasure[] {
        return this.measuresByEvaluation[modelEvaluation.modelEvaluationId] || [];
    }

    /**
     * Displays the form for creating a new evaluation run.
     */
    createModelEvaluation() {
        this.selectedModelEvaluationId = null;
        this.displayEvaluationForm = true;
    }

    /**
     * Displays the form for editing an evaluation run.
     * @param modelEvaluation The evaluation run to be edited
     */
    showModelEvaluationForm(modelEvaluation: ModelEvaluation) {
        this.selectedModelEvaluationId = modelEvaluation.modelEvaluationId;
        this.displayEvaluationForm = true;
    }

    /**
     * Deletes an evaluation run and everything recorded within it.
     * @param modelEvaluation The evaluation run to be deleted
     */
    deleteModelEvaluation(modelEvaluation: ModelEvaluation) {
        this.modelEvaluationService.deleteModelEvaluation(modelEvaluation.modelEvaluationId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'ModelEvaluation.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['ModelEvaluation.Deleted']
                        });
                    });
                    this.loadModelEvaluations();
                },
                error: error => this.showError(error)
            });
    }

    /**
     * Displays the form for adding a measure to an evaluation run.
     * @param modelEvaluation The evaluation run the measure belongs to
     */
    createEvaluationMeasure(modelEvaluation: ModelEvaluation) {
        this.measureFormEvaluationId = modelEvaluation.modelEvaluationId;
        this.selectedEvaluationMeasureId = null;
        this.displayMeasureForm = true;
    }

    /**
     * Displays the form for editing a measure.
     * @param modelEvaluation The evaluation run the measure belongs to
     * @param evaluationMeasure The measure to be edited
     */
    showEvaluationMeasureForm(modelEvaluation: ModelEvaluation, evaluationMeasure: EvaluationMeasure) {
        this.measureFormEvaluationId = modelEvaluation.modelEvaluationId;
        this.selectedEvaluationMeasureId = evaluationMeasure.measureId;
        this.displayMeasureForm = true;
    }

    /**
     * Deletes a measure.
     * @param evaluationMeasure The measure to be deleted
     */
    deleteEvaluationMeasure(evaluationMeasure: EvaluationMeasure) {
        this.evaluationMeasureService.deleteEvaluationMeasure(evaluationMeasure.measureId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'EvaluationMeasure.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['EvaluationMeasure.Deleted']
                        });
                    });
                    this.loadModelEvaluations();
                },
                error: error => this.showError(error)
            });
    }

    /**
     * Handles the event when either form is closed.
     */
    onFormClosed() {
        this.displayEvaluationForm = false;
        this.displayMeasureForm = false;
        this.loadModelEvaluations();
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

    /**
     * Shows an error toast.
     * @param error The error to be shown
     */
    private showError(error: any) {
        this.translateService.get('Error').subscribe(translation => {
            this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
            });
        });
    }
}
