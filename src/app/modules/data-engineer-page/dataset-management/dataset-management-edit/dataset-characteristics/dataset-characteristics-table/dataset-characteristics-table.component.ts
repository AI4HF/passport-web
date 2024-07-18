import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { DatasetCharacteristic } from "../../../../../../shared/models/datasetCharacteristic.model";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../../../shared/models/dataset.model";

@Component({
    selector: 'app-dataset-characteristics-table',
    templateUrl: './dataset-characteristics-table.component.html',
    styleUrls: ['./dataset-characteristics-table.component.scss']
})
export class DatasetCharacteristicsTableComponent extends BaseComponent implements OnInit {

    selectedDataset: Dataset;
    characteristics: DatasetCharacteristic[] = [];
    displayForm: boolean = false;
    selectedCharacteristic: DatasetCharacteristic = null;
    loading: boolean = true;
    columns: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.columns = [
            { field: 'characteristicName', header: 'DatasetCharacteristic.CharacteristicName' },
            { field: 'featureId', header: 'DatasetCharacteristic.FeatureID' },
            { field: 'value', header: 'DatasetCharacteristic.Value' },
            { field: 'valueDataType', header: 'DatasetCharacteristic.ValueDataType' }
        ];

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.selectedDataset = data['dataset'];
            this.loadCharacteristics();
        });
    }

    loadCharacteristics() {
        this.datasetCharacteristicService.getCharacteristicsByDatasetId(this.selectedDataset.datasetId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: characteristics => {
                    this.characteristics = characteristics;
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

    deleteCharacteristic(characteristic: DatasetCharacteristic) {
        this.datasetCharacteristicService.deleteCharacteristic(characteristic.datasetId, characteristic.featureId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.characteristics = this.characteristics.filter(c => c.featureId !== characteristic.featureId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('DatasetCharacteristic.Deleted')
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

    showCharacteristicForm(characteristic: DatasetCharacteristic) {
        this.selectedCharacteristic = characteristic;
        this.displayForm = true;
    }

    createCharacteristic() {
        this.selectedCharacteristic = null;
        this.displayForm = true;
    }

    onFormClosed() {
        this.displayForm = false;
        this.loadCharacteristics();
    }

    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
