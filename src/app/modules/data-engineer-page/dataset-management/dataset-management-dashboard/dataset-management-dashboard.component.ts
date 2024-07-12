import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../shared/models/dataset.model";
import { Table } from "primeng/table";
import { DatasetService } from "../../../../core/services/dataset.service";
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

    datasetList: Dataset[] = [];

    // columns of Dataset to be displayed on a table
    columns: any[];

    // flag indicating the datasets are being retrieved from the server
    loading: boolean = true;

    constructor(protected injector: Injector, private datasetService: DatasetService) {
        super(injector);

        // initialize variables
        this.columns = [
            { header: 'ID', field: 'datasetId' },
            { header: 'Title', field: 'title' },
            { header: 'Description', field: 'description' },
            { header: 'Version', field: 'version' },
            { header: 'Reference Entity', field: 'referenceEntity' }
        ];
    }

    ngOnInit() {
        this.getDatasetList();
    }

    /**
     * Retrieves all datasets from the server
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
     * Filters a table of information based on a given search criteria
     * @param table Table to be filtered
     * @param event Keyboard type event where search text is captured
     */
    filter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigate the user to Dataset create page
     */
    createDataset() {
        this.router.navigate([`/${DatasetManagementRoutingModule.route}/new`]);
    }

    /**
     * Navigate the user to Dataset edit page
     */
    editDataset(id: number) {
        this.router.navigate([`/${DatasetManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Delete a dataset
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
