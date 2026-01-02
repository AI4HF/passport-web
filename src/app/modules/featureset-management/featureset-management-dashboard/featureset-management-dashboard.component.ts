import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { FeatureSet } from "../../../shared/models/featureset.model";
import { Table } from "primeng/table";
import { FeatureSetManagementRoutingModule } from "../featureset-management-routing.module";
import { Experiment } from "../../../shared/models/experiment.model";

/**
 * Dashboard component for feature set management.
 */
@Component({
    selector: 'app-featureset-management-dashboard',
    templateUrl: './featureset-management-dashboard.component.html',
    styleUrls: ['./featureset-management-dashboard.component.scss']
})
export class FeatureSetManagementDashboardComponent extends BaseComponent implements OnInit {

    /** List of feature sets */
    featureSetList: FeatureSet[] = [];

    /** List of experiments */
    experiments: Experiment[] = [];

    /** Columns to be displayed in the table */
    columns: any[];

    /** Loading state of the table */
    loading: boolean = true;

    /** Visibility flag for cascade validation dialog */
    displayCascadeDialog: boolean = false;

    /** List of tables to display in the validation dialog */
    cascadeTables: string = '';

    /** Authorization status for the validation dialog */
    cascadeAuthorized: boolean = false;

    /** Temporary storage of the feature set ID pending deletion */
    pendingDeletionId: string = null;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);

        // Initialize columns
        this.columns = [
            { header: 'ID', field: 'featuresetId' },
            { header: 'Title', field: 'title' },
            { header: 'Description', field: 'description' },
            { header: 'URL', field: 'featuresetURL' },
            { header: 'Experiment', field: 'experimentId' },
            { header: 'Created At', field: 'createdAt' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        if(this.activeStudyService.getActiveStudy()){
            this.loadExperimentsAndFeatureSets(this.activeStudyService.getActiveStudy());
        }
    }

    /**
     * Retrieves all feature sets from the server.
     * @param studyId ID of the study
     */
    getFeatureSetList(studyId: String) {
        this.loading = true;
        this.featureSetService.getAllFeatureSetsByStudyId(studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (featureSetList: FeatureSet[]) => this.featureSetList = featureSetList,
                error: (error: any) => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                },
                complete: () => this.loading = false
            });
    }

    /**
     * Loads the list of experiments by studyId.
     * @param studyId ID of the study
     */
    loadExperimentsByStudyId(studyId: String) {
        this.experimentService.getExperimentListByStudyId(studyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: experiments => this.experiments = experiments,
                error: (error: any) => {
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
     * Gets the name of the experiment for the given experiment ID.
     * @param experimentId The ID of the experiment
     * @returns The name of the experiment
     */
    getExperimentName(experimentId: string): string {
        const experiment = this.experiments.find(exp => exp.experimentId === experimentId);
        return experiment ? experiment.researchQuestion : '';
    }

    /**
     * Filters a table of information based on a given search criteria.
     * @param table Table to be filtered
     * @param event Keyboard type event where search text is captured
     */
    filter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates the user to the FeatureSet create page.
     */
    createFeatureSet() {
        if (this.experiments.length === 0) {
            this.translateService.get(['Warning', 'FeatureSetManagement.NoExperiments']).subscribe(translations => {
                this.messageService.add({
                    severity: 'warn',
                    summary: translations['Warning'],
                    detail: translations['FeatureSetManagement.NoExperiments']
                });
            });
            return;
        }
        this.router.navigate([`${FeatureSetManagementRoutingModule.route}/new`]);
    }

    /**
     * Navigates the user to the FeatureSet edit page.
     * @param id The ID of the FeatureSet to be edited
     */
    editFeatureSet(id: string) {
        this.router.navigate([`${FeatureSetManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Initiates the deletion process by validating permissions first.
     * @param id The ID of the FeatureSet to be deleted
     */
    deleteFeatureSet(id: string) {
        this.pendingDeletionId = id;
        this.loading = true;

        this.featureSetService.validateFeatureSetDeletion(id, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: string) => {
                    this.loading = false;
                    if (!response || response.trim() === '') {
                        this.executeDeletion(this.pendingDeletionId);
                    } else {
                        this.cascadeTables = response;
                        this.cascadeAuthorized = true;
                        this.displayCascadeDialog = true;
                    }
                },
                error: (error: any) => {
                    this.loading = false;
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
     * @param id The ID of the FeatureSet to be deleted
     */
    executeDeletion(id: string) {
        this.loading = true;
        this.featureSetService.deleteFeatureSet(id, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.getFeatureSetList(this.activeStudyService.getActiveStudy());
                    this.translateService.get(['Success', 'FeatureSetManagement.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['FeatureSetManagement.Deleted'] // Assumed translation key based on context
                        });
                    });
                    this.pendingDeletionId = null;
                },
                error: (error: any) => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.pendingDeletionId = null;
                },
                complete: () => this.loading = false
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
     * Loads the list of experiments and feature sets by studyId.
     * @param studyId ID of the study
     */
    loadExperimentsAndFeatureSets(studyId: String) {
        this.loadExperimentsByStudyId(studyId);
        this.getFeatureSetList(studyId);
    }
}

