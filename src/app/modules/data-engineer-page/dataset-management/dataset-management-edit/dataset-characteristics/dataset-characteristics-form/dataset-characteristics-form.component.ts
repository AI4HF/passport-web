import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatasetCharacteristic } from "../../../../../../shared/models/datasetCharacteristic.model";
import { takeUntil, switchMap } from "rxjs";

@Component({
    selector: 'app-dataset-characteristics-form',
    templateUrl: './dataset-characteristics-form.component.html',
    styleUrls: ['./dataset-characteristics-form.component.scss']
})
export class DatasetCharacteristicsFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() datasetId: number;
    @Input() characteristic: DatasetCharacteristic;
    @Output() formClosed = new EventEmitter<void>();

    characteristicForm: FormGroup;
    display: boolean = false;
    features: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.loadFeatures();
        this.loadCharacteristic();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['characteristic'] && this.characteristic) {
            this.loadCharacteristic();
        }
    }

    loadFeatures() {
        this.datasetService.getDatasetById(this.datasetId)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(dataset => this.featureService.getFeaturesByFeatureSetId(dataset.featuresetId))
            )
            .subscribe(features => this.features = features);
    }

    loadCharacteristic() {
        if (this.characteristic) {
            this.initializeForm();
        } else {
            this.characteristic = new DatasetCharacteristic({ datasetId: this.datasetId, featureId: null });
            this.initializeForm();
        }
        this.display = true;
    }

    initializeForm() {
        this.characteristicForm = new FormGroup({
            featureId: new FormControl(this.characteristic.featureId, Validators.required),
            characteristicName: new FormControl(this.characteristic.characteristicName, Validators.required),
            value: new FormControl(this.characteristic.value, Validators.required),
            valueDataType: new FormControl(this.characteristic.valueDataType, Validators.required)
        });
    }

    saveCharacteristic() {
        const formValues = this.characteristicForm.value;
        const characteristicPayload = {
            featureId: formValues.featureId.featureId,
            characteristicName: formValues.characteristicName,
            value: +formValues.value,
            valueDataType: formValues.valueDataType,
            datasetId: this.datasetId
        };
            const newCharacteristic: DatasetCharacteristic = new DatasetCharacteristic({ ...characteristicPayload });
            this.datasetCharacteristicService.createCharacteristic(newCharacteristic)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: characteristic => {
                        this.characteristic = characteristic;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DatasetCharacteristic.Created')
                        });
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });
        }

    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}

