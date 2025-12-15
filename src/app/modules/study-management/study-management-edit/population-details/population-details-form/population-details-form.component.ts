import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Population } from "../../../../../shared/models/population.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing population forms within a population.
 */
@Component({
    selector: 'app-population-details-form',
    templateUrl: './population-details-form.component.html',
    styleUrls: ['./population-details-form.component.scss']
})
export class PopulationDetailsFormComponent extends BaseComponent implements OnInit {

    /** The ID of the population to be edited or created */
    @Input() populationId: string;

    /** The ID of the working study */
    @Input() currentStudyId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the population */
    populationForm: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The population being edited or created */
    selectedPopulation: Population;

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
        this.initializeForm();
        if (this.populationId) {
            this.isUpdateMode = true;
            this.loadPopulation(this.populationId);
        } else {
            this.selectedPopulation = new Population({});
            this.display = true;
        }
    }

    /**
     * Initializes the form group with the population data.
     */
    initializeForm() {
        this.populationForm = new FormGroup({
            populationUrl: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            characteristics: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the population data by ID and updates the form.
     * @param populationId The ID of the population to be loaded
     */
    loadPopulation(populationId: string) {
        this.populationService.getPopulationById(populationId, this.currentStudyId).pipe(takeUntil(this.destroy$)).subscribe({
            next: population => {
                this.selectedPopulation = population;
                this.updateForm();
                this.display = true;
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
     * Updates the form with the loaded population details.
     */
    updateForm() {
        this.populationForm.patchValue({
            populationUrl: this.selectedPopulation.populationUrl,
            description: this.selectedPopulation.description,
            characteristics: this.selectedPopulation.characteristics
        });
    }

    /**
     * Saves the population, either creating a new one or updating an existing one.
     */
    savePopulation() {
        const formValues = this.populationForm.value;
        if (!this.selectedPopulation.populationId) {
            const newPopulation: Population = new Population({ ...formValues, populationId: this.populationId, studyId: this.currentStudyId  });
            this.populationService.createPopulation(newPopulation, this.currentStudyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: population => {
                        this.selectedPopulation = population;
                        this.initializeForm();
                        this.translateService.get(['Success', 'StudyManagement.Population.PopulationCreated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['StudyManagement.Population.PopulationCreated']
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });
        } else {
            const updatedPopulation: Population = new Population({ populationId: this.selectedPopulation.populationId, studyId: this.currentStudyId, ...formValues });
            this.populationService.updatePopulation(updatedPopulation, this.currentStudyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (population: Population) => {
                        this.selectedPopulation = population;
                        this.initializeForm();
                        this.translateService.get(['Success', 'StudyManagement.Population.PopulationUpdated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['StudyManagement.Population.PopulationUpdated']
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });
        }
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
