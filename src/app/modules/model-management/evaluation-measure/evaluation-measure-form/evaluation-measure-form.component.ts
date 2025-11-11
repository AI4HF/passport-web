import {Component, EventEmitter, HostListener, Injector, Input, OnInit, Output} from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import {EvaluationMeasure} from "../../../../shared/models/evaluationMeasure.model";

/**
 * Component for managing the form to create or update EvaluationMeasure assignments.
 */
@Component({
    selector: 'app-evaluation-measure-form',
    templateUrl: './evaluation-measure-form.component.html',
    styleUrls: ['./evaluation-measure-form.component.scss']
})
export class EvaluationMeasureFormComponent extends BaseComponent implements OnInit {

    /** The ID of the Model */
    @Input() modelId: string;

    /** The ID of the evaluationMeasure to be updated */
    @Input() evaluationMeasureId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the EvaluationMeasure */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The current EvaluationMeasure being edited */
    evaluationMeasure: EvaluationMeasure;

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
        this.isUpdateMode = !!this.evaluationMeasureId;
        this.initializeForm();
        this.display = true;

        if (this.isUpdateMode) {
            this.evaluationMeasureService.getEvaluationMeasureById(this.evaluationMeasureId, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: evaluationMeasure => {
                        this.evaluationMeasure = evaluationMeasure;
                        this.initializeForm();
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
        } else {
            this.evaluationMeasure = new EvaluationMeasure({ modelId: this.modelId });
        }
    }

    /**
     * Initializes the form group with the EvaluationMeasure data.
     */
    initializeForm() {
        this.form = new FormGroup({
            name: new FormControl(this.evaluationMeasure?.name || '', Validators.required),
            value: new FormControl(this.evaluationMeasure?.value || '', Validators.required),
            dataType: new FormControl(this.evaluationMeasure?.dataType || '', Validators.required),
            description: new FormControl(this.evaluationMeasure?.description || '', Validators.required)
        });
    }

    /**
     * Saves the EvaluationMeasure, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        this.evaluationMeasure = new EvaluationMeasure({ measureId: this.evaluationMeasureId, modelId: this.modelId,  ...formValues});

        if (this.isUpdateMode) {
            this.updateEvaluationMeasure(this.evaluationMeasure);
        } else {
            this.createEvaluationMeasure(this.evaluationMeasure);
        }
    }

    /**
     * Creates a new EvaluationMeasure.
     * @param evaluationMeasure The EvaluationMeasure to be created
     */
    createEvaluationMeasure(evaluationMeasure: EvaluationMeasure) {
        this.evaluationMeasureService.createEvaluationMeasure(evaluationMeasure, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'EvaluationMeasure.Created']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['EvaluationMeasure.Created']
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
     * Updates an existing EvaluationMeasure.
     * @param evaluationMeasure The EvaluationMeasure to be updated
     */
    updateEvaluationMeasure(evaluationMeasure: EvaluationMeasure) {
        this.evaluationMeasureService.updateEvaluationMeasure(evaluationMeasure, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'EvaluationMeasure.Updated']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['EvaluationMeasure.Updated']
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

    /**
     * Closes the popup when the user presses the Escape key.
     */
    @HostListener('document:keydown.escape', ['$event'])
    onEscapePress(event: KeyboardEvent) {
        this.closeDialog();
    }
}
