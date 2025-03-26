import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { Population } from "../../../../../shared/models/population.model";
import { takeUntil } from "rxjs";

/**
 * Component to display and manage populations within a population set.
 */
@Component({
    selector: 'app-population-details-table',
    templateUrl: './population-details-table.component.html',
    styleUrls: ['./population-details-table.component.scss']
})
export class PopulationDetailsTableComponent extends BaseComponent implements OnInit {

    /** List of populations in the selected population set */
    populations: Population[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The population ID selected for editing */
    selectedPopulationId: string = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

    /** Current study Id */
    studyId: string = null;

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
            { field: 'populationId', header: 'PopulationManagement.PopulationID' },
            { field: 'title', header: 'PopulationManagement.PopulationTitle' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.studyId = params.get('id');
            this.loadPopulations();
        });
    }

    /**
     * Loads the populations of the current study.
     */
    loadPopulations() {
        this.populationService.getPopulationByStudyId(this.studyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: populations => {
                    this.populations = populations;
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
     * Deletes a population by its ID.
     * @param populationId The ID of the population to be deleted
     */
    deletePopulation(populationId: string) {
        this.populationService.deletePopulation(populationId, this.studyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.populations = this.populations.filter(f => f.populationId !== populationId);
                    this.translateService.get(['Success', 'StudyManagement.Population.PopulationDeleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['StudyManagement.Population.PopulationDeleted']
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
     * Displays the form for editing a population.
     * @param populationId The ID of the population to be edited
     */
    showPopulationForm(populationId: string) {
        this.selectedPopulationId = populationId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new population.
     */
    createPopulation() {
        this.selectedPopulationId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadPopulations();
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


