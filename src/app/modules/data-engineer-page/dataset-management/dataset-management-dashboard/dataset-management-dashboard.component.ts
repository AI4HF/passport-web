import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../shared/models/dataset.model";
import { Table } from "primeng/table";
import { DatasetManagementRoutingModule } from "../dataset-management-routing.module";

/**
 * Dashboard component for dataset management.
 */
@Component({
    selector: 'app-dataset-management-dashboard',
    templateUrl: './dataset-management-dashboard.component.html',
    styleUrls: ['./dataset-management-dashboard.component.scss']
})
export class DatasetManagementDashboardComponent extends BaseComponent implements OnInit {

    /** List of datasets */
    datasetList: Dataset[] = [];

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

        this.columns = [
            { header: 'ID', field: 'datasetId' },
            { header: 'Title', field: 'title' },
            { header: 'Description', field: 'description' },
            { header: 'Version', field: 'version' },
            { header: 'Reference Entity', field: 'referenceEntity' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.getDatasetList();
    }

    /**
     * Retrieves all datasets from the server.
     */
    getDatasetList() {
        this.loading = true;
        this.datasetService.getAllDatasets()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (datasetList: Dataset[]) => this.datasetList = datasetList,
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
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates the user to the Dataset create page.
     */
    createDataset() {
        this.router.navigate([`/${DatasetManagementRoutingModule.route}/new`]);
    }

    /**
     * Navigates the user to the Dataset edit page.
     * @param id The ID of the Dataset to be edited
     */
    editDataset(id: number) {
        this.router.navigate([`/${DatasetManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Deletes a dataset.
     * @param id The ID of the Dataset to be deleted
     */
    deleteDataset(id: number) {
        this.loading = true;
        this.datasetService.deleteDataset(id).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => this.getDatasetList(),
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
