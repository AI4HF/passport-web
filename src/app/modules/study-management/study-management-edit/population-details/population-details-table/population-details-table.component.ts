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
     * Indicates whether user can edit this page
     */
    viewMode: boolean = false;

    /** Visibility flag for cascade validation dialog */
    displayCascadeDialog: boolean = false;

    /** List of tables to display in the validation dialog */
    cascadeTables: string = '';

    /** Authorization status for the validation dialog */
    cascadeAuthorized: boolean = false;

    /** Temporary storage of the population ID pending deletion */
    pendingDeletionId: string = null;

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
        this.route.queryParams.subscribe(params => {
            this.viewMode = params['viewMode'] === 'true';
        });
        
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
     * Initiates the deletion process by validating permissions first.
     * @param populationId The ID of the population to be deleted
     */
    deletePopulation(populationId: string) {
        this.pendingDeletionId = populationId;

        this.populationService.validatePopulationDeletion(populationId, this.studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: string) => {
                    if (!response || response.trim() === '') {
                        this.executeDeletion(this.pendingDeletionId);
                    } else {
                        this.cascadeTables = response;
                        this.cascadeAuthorized = true;
                        this.displayCascadeDialog = true;
                    }
                },
                error: (error: any) => {
                    if (error.status === 409) {
                        this.cascadeTables = error.error || '';
                        this.cascadeAuthorized = false;
                        this.displayCascadeDialog = true;
                    } else {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                        this.pendingDeletionId = null;
                    }
                }
            });
    }

    /**
     * Executes the actual deletion after validation or confirmation.
     * @param populationId The ID of the population to be deleted
     */
    executeDeletion(populationId: string) {
        this.populationService.deletePopulation(populationId, this.studyId)
            .pipe(takeUntil(this.destroy$))
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
                    this.pendingDeletionId = null;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.pendingDeletionId = null;
                }
            });
    }

    /**
     * Handles the cancellation of the cascade dialog.
     */
    onCascadeDialogCancel() {
        this.displayCascadeDialog = false;
        this.pendingDeletionId = null;
        this.cascadeTables = '';
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


