import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../shared/components/base.component";
import { Dataset } from "../../../shared/models/dataset.model";
import { CatalogueDataset } from "../../../shared/models/catalogueDataset.model";
import { StorageUtil } from "../../../core/services/storageUtil.service";

/**
 * The Data Steward's working list: the datasets their own organization extracted, with the
 * publication decision each one carries. Datasets belonging to other organizations in the study are
 * not shown - and the backend rejects writes to them regardless.
 */
@Component({
    selector: 'app-steward-dataset-table',
    templateUrl: './steward-dataset-table.component.html',
    styleUrls: ['./steward-dataset-table.component.scss']
})
export class StewardDatasetTableComponent extends BaseComponent implements OnInit {
    /** The datasets of the steward's own organization */
    datasetList: Dataset[] = [];
    /** The publication record per dataset, where one exists */
    catalogueByDatasetId: { [datasetId: string]: CatalogueDataset } = {};
    /** Loading state of the table */
    loading: boolean = true;
    /** Determines if the metadata form is displayed */
    displayForm: boolean = false;
    /** The dataset whose metadata is being edited */
    selectedDataset: Dataset = null;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.activeStudyService.getActiveStudy()) {
            this.loadDatasets();
        }
    }

    /**
     * Loads the study's datasets and keeps the ones this steward's organization owns.
     */
    loadDatasets() {
        const organizationId = StorageUtil.retrieveOrganizationId();
        this.datasetService.getAllDatasetsByStudyId(this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: datasets => {
                this.datasetList = datasets.filter(dataset => dataset.organizationId === organizationId);
                this.datasetList.forEach(dataset => this.loadCatalogueDataset(dataset));
            },
            error: (error) => {
                this.loading = false;
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Loads the publication record of one dataset, if it has one.
     * @param dataset The dataset
     */
    loadCatalogueDataset(dataset: Dataset) {
        this.catalogueDatasetService
            .getCatalogueDatasetList(dataset.datasetId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: records => {
                if (records.length) {
                    this.catalogueByDatasetId[dataset.datasetId] = records[0];
                }
            }
        });
    }

    /**
     * Whether a dataset has been marked for publication.
     * @param dataset The dataset
     */
    isPublished(dataset: Dataset): boolean {
        return !!this.catalogueByDatasetId[dataset.datasetId];
    }

    /**
     * Opens the metadata form for a dataset.
     * @param dataset The dataset to complete
     */
    editMetadata(dataset: Dataset) {
        this.selectedDataset = dataset;
        this.displayForm = true;
    }

    /**
     * Reloads once the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.selectedDataset = null;
        this.catalogueByDatasetId = {};
        this.loadDatasets();
    }

    /**
     * Filters the table globally based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
