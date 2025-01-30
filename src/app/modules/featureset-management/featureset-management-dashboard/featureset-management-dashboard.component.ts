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
            { header: 'Experiment', field: 'experimentId' }
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
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                },
                complete: () => this.loading = false
            });
    }

    /**
     * Loads the list of experiments by studyId.
     * @param studyId ID of the study
     */
    loadExperimentsByStudyId(studyId: number) {
        this.experimentService.getExperimentListByStudyId(studyId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: experiments => this.experiments = experiments,
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Gets the name of the experiment for the given experiment ID.
     * @param experimentId The ID of the experiment
     * @returns The name of the experiment
     */
    getExperimentName(experimentId: number): string {
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
            this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('Warning'),
                detail: this.translateService.instant('FeatureSetManagement.NoExperiments')
            });
            return;
        }
        this.router.navigate([`${FeatureSetManagementRoutingModule.route}/new`]);
    }

    /**
     * Navigates the user to the FeatureSet edit page.
     * @param id The ID of the FeatureSet to be edited
     */
    editFeatureSet(id: number) {
        this.router.navigate([`${FeatureSetManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Deletes a feature set.
     * @param id The ID of the FeatureSet to be deleted
     */
    deleteFeatureSet(id: number) {
        this.loading = true;
        this.featureSetService.deleteFeatureSet(id, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => this.getFeatureSetList(this.activeStudyService.getActiveStudy()),
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                },
                complete: () => this.loading = false
            });
    }

    /**
     * Loads the list of experiments and feature sets by studyId.
     * @param studyId ID of the study
     */
    loadExperimentsAndFeatureSets(studyId: String) {
        this.loadExperimentsByStudyId(+studyId);
        this.getFeatureSetList(studyId);
    }
}

