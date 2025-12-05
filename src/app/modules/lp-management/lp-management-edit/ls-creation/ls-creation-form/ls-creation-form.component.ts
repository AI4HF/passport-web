import { HttpClient } from '@angular/common/http';
import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningStage } from '../../../../../shared/models/learningStage.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing and displaying the form for creating or updating learning stages.
 */
@Component({
    selector: 'app-learning-stage-creation-form',
    templateUrl: './ls-creation-form.component.html',
    styleUrls: ['./ls-creation-form.component.scss']
})
export class LsCreationFormComponent extends BaseComponent implements OnInit {

    /** The ID of the learning process */
    @Input() learningProcessId: string;

    /** The ID of the learning stage to be edited or created */
    @Input() learningStageId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the learning stage */
    form: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** The learning stage to be edited or created */
    learningStage: LearningStage;

    /** List of hardcoded learning stages loaded from JSON */
    hardcodedLearningStages: LearningStage[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredLearningStages: LearningStage[] = [];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param http The HTTP client for loading JSON
     */
    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.initializeForm();
        this.loadHardcodedLearningStages();
        this.display = true;
        if (this.learningStageId) {
            this.isUpdateMode = true;
            this.loadLearningStage();
        } else {
            this.learningStage = new LearningStage({ learningProcessId: this.learningProcessId });
        }
    }

    /**
     * Initializes the form group with the learning stage data.
     */
    initializeForm() {
        this.form = new FormGroup({
            learningStageName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            datasetPercentage: new FormControl('', [
                Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern('^[0-9]+$')
            ])
        });
    }

    /**
     * Loads the learning stage data if in update mode.
     */
    loadLearningStage() {
        this.learningStageService.getLearningStageById(this.learningStageId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningStage => {
                    this.learningStage = learningStage;
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
     * Updates the form with the loaded learning stage details.
     */
    updateForm() {
        this.form.patchValue({
            learningStageName: this.learningStage.learningStageName,
            description: this.learningStage.description,
            datasetPercentage: this.learningStage.datasetPercentage
        });
    }

    /**
     * Filters the hardcoded learning stages based on user input.
     */
    filterLearningStages(event: any) {
        const query = event.query.toLowerCase();
        this.filteredLearningStages = this.hardcodedLearningStages.filter(stage =>
            stage.learningStageName.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills the form with the selected hardcoded learning stage.
     */
    selectAutoFill(event: any) {
        const selectedStage = event.value;
        this.form.setValue({
            learningStageName: selectedStage.learningStageName,
            description: selectedStage.description,
            datasetPercentage: selectedStage.datasetPercentage
        });
    }

    /**
     * Saves the learning stage, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.form.value;

        const learningStagePayload = {
            learningProcessId: this.learningProcessId,
            learningStageName: formValues.learningStageName,
            description: formValues.description,
            datasetPercentage: formValues.datasetPercentage
        };

        if (this.isUpdateMode) {
            this.updateLearningStage(learningStagePayload);
        } else {
            this.createLearningStage(learningStagePayload);
        }
    }

    /**
     * Updates an existing learning stage.
     * @param learningStagePayload The payload with the learning stage data
     */
    updateLearningStage(learningStagePayload: any) {
        const updatedLearningStage: LearningStage = new LearningStage({
            learningStageId: this.learningStage.learningStageId,
            ...learningStagePayload
        });

        this.learningStageService.updateLearningStage(updatedLearningStage, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'LearningProcessManagement.Updated']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['LearningProcessManagement.Updated']
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
     * Creates a new learning stage.
     * @param learningStagePayload The payload with the learning stage data
     */
    createLearningStage(learningStagePayload: any) {
        const newLearningStage: LearningStage = new LearningStage({
            ...learningStagePayload
        });

        this.learningStageService.createLearningStage(newLearningStage, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.translateService.get(['Success', 'LearningProcessManagement.Created']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['LearningProcessManagement.Created']
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
     * Loads the hardcoded learning stages from a JSON file.
     */
    loadHardcodedLearningStages() {
        this.http.get<LearningStage[]>('assets/data/example-learning-stages.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedLearningStages = data,
                error: err => console.error('Failed to load hardcoded learning stages', err)
            });
    }
}
