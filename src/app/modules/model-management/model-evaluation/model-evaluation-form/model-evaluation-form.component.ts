import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { ModelEvaluation } from "../../../../shared/models/modelEvaluation.model";

/**
 * Component for the form that creates or updates an evaluation run of a Model.
 */
@Component({
    selector: 'app-model-evaluation-form',
    templateUrl: './model-evaluation-form.component.html',
    styleUrls: ['./model-evaluation-form.component.scss']
})
export class ModelEvaluationFormComponent extends BaseComponent implements OnInit {

    /** The ID of the Model the run belongs to */
    @Input() modelId: string;

    /** The ID of the evaluation run to be updated */
    @Input() modelEvaluationId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the evaluation run */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The current evaluation run being edited */
    modelEvaluation: ModelEvaluation;

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
        this.isUpdateMode = !!this.modelEvaluationId;
        this.modelEvaluation = new ModelEvaluation({ modelId: this.modelId });
        this.initializeForm();
        this.display = true;

        if (this.isUpdateMode) {
            this.modelEvaluationService.getModelEvaluationById(this.modelEvaluationId, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: modelEvaluation => {
                        this.modelEvaluation = modelEvaluation;
                        this.initializeForm();
                    },
                    error: error => this.showError(error)
                });
        }
    }

    /**
     * Initializes the form group with the evaluation run data.
     */
    initializeForm() {
        this.form = new FormGroup({
            trigger: new FormControl(this.modelEvaluation?.trigger || '', Validators.required),
            aggregationMethod: new FormControl(this.modelEvaluation?.aggregationMethod || ''),
            executedAt: new FormControl(this.modelEvaluation?.executedAt || null),
            executedBy: new FormControl(this.modelEvaluation?.executedBy || ''),
            description: new FormControl(this.modelEvaluation?.description || '')
        });
    }

    /**
     * Saves the evaluation run, either creating a new one or updating an existing one.
     */
    save() {
        const modelEvaluation = new ModelEvaluation({
            modelEvaluationId: this.modelEvaluationId,
            modelId: this.modelId,
            organizationId: this.modelEvaluation?.organizationId,
            ...this.form.value
        });

        const request = this.isUpdateMode
            ? this.modelEvaluationService.updateModelEvaluation(modelEvaluation, this.activeStudyService.getActiveStudy())
            : this.modelEvaluationService.createModelEvaluation(modelEvaluation, this.activeStudyService.getActiveStudy());

        const messageKey = this.isUpdateMode ? 'ModelEvaluation.Updated' : 'ModelEvaluation.Created';

        request.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.translateService.get(['Success', messageKey]).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations[messageKey]
                    });
                });
                this.closeDialog();
            },
            error: error => this.showError(error)
        });
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
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
