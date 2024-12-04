import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { DatasetCharacteristic } from "../../../../../shared/models/datasetCharacteristic.model";
import { takeUntil } from "rxjs";

/**
 * Component to display and manage dataset characteristics.
 */
@Component({
    selector: 'app-dataset-characteristics-table',
    templateUrl: './dataset-characteristics-table.component.html',
    styleUrls: ['./dataset-characteristics-table.component.scss']
})
export class DatasetCharacteristicsTableComponent extends BaseComponent implements OnInit {

    /** The selected dataset's ID */
    selectedDatasetId: number;

    /** List of dataset characteristics */
    characteristics: DatasetCharacteristic[] = [];

    /** Map of feature IDs to feature names */
    featureMap: Map<number, string> = new Map<number, string>();

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The characteristic selected for editing */
    selectedCharacteristic: DatasetCharacteristic = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

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
            { field: 'characteristicName', header: 'DatasetManagement.CharacteristicName' },
            { field: 'featureName', header: 'DatasetManagement.FeatureName' },
            { field: 'value', header: 'DatasetManagement.Value' },
            { field: 'valueDataType', header: 'DatasetManagement.ValueDataType' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.selectedDatasetId = +params.get('id');
            this.loadFeatures();
        });
    }

    /**
     * Loads the list of features.
     */
    loadFeatures() {
        this.featureService.getAllFeatures(+this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: features => {
                this.featureMap = new Map(features.map(feature => [feature.featureId, feature.title]));
                this.loadCharacteristics();
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
                this.loading = false;
            }
        });
    }

    /**
     * Loads the characteristics of the selected dataset.
     */
    loadCharacteristics() {
        this.datasetCharacteristicService.getCharacteristicsByDatasetId(this.selectedDatasetId, +this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: characteristics => {
                    this.characteristics = characteristics.map(characteristic => ({
                        ...characteristic,
                        featureName: this.featureMap.get(characteristic.featureId) || 'Unknown'
                    }));
                    this.loading = false;
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Deletes a characteristic by its ID.
     * @param characteristic The characteristic to be deleted
     */
    deleteCharacteristic(characteristic: DatasetCharacteristic) {
        this.datasetCharacteristicService.deleteCharacteristic(characteristic.datasetId, characteristic.featureId, +this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.characteristics = this.characteristics.filter(c => c.featureId !== characteristic.featureId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('DatasetManagement.Deleted')
                    });
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Displays the form for editing a characteristic.
     * @param characteristic The characteristic to be edited
     */
    showCharacteristicForm(characteristic: DatasetCharacteristic) {
        this.selectedCharacteristic = characteristic;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new characteristic.
     */
    createCharacteristic() {
        this.selectedCharacteristic = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadCharacteristics();
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

