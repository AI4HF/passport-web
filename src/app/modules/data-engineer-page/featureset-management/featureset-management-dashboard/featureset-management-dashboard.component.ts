import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { FeatureSet } from "../../../../shared/models/featureset.model";
import { Table } from "primeng/table";
import { FeatureSetService } from "../../../../core/services/featureset.service";
import { FeatureSetManagementRoutingModule } from "../featureset-management-routing.module";
import { Experiment } from "../../../../shared/models/experiment.model";

/**
 * Dashboard component for feature set management.
 */
@Component({
    selector: 'app-featureset-management-dashboard',
    templateUrl: './featureset-management-dashboard.component.html',
    styleUrls: ['./featureset-management-dashboard.component.scss']
})
export class FeatureSetManagementDashboardComponent extends BaseComponent implements OnInit {

    featureSetList: FeatureSet[] = [];
    experiments: Experiment[] = [];

    // columns of FeatureSet to be displayed on a table
    columns: any[];

    // flag indicating the feature sets are being retrieved from the server
    loading: boolean = true;

    constructor(protected injector: Injector, private featureSetService: FeatureSetService) {
        super(injector);

        // initialize variables
        this.columns = [
            { header: 'ID', field: 'featuresetId' },
            { header: 'Title', field: 'title' },
            { header: 'Description', field: 'description' },
            { header: 'URL', field: 'featuresetURL' },
            { header: 'Experiment', field: 'experimentId' }
        ];
    }

    ngOnInit() {
        this.loadExperiments();
        this.getFeatureSetList();
    }

    /**
     * Retrieves all feature sets from the server
     */
    getFeatureSetList() {
        this.loading = true;
        this.featureSetService.getAllFeatureSets()
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
     * Loads the list of experiments.
     */
    loadExperiments() {
        this.experimentService.getAllExperiments().pipe(takeUntil(this.destroy$))
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
     * Filters a table of information based on a given search criteria
     * @param table Table to be filtered
     * @param event Keyboard type event where search text is captured
     */
    filter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigate the user to FeatureSet create page
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
     * Navigate the user to FeatureSet edit page
     */
    editFeatureSet(id: number) {
        this.router.navigate([`${FeatureSetManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Delete a feature set
     */
    deleteFeatureSet(id: number) {
        this.loading = true;
        this.featureSetService.deleteFeatureSet(id).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => this.getFeatureSetList(),
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
}
