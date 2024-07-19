import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatasetCharacteristic } from "../../../../../../shared/models/datasetCharacteristic.model";
import { takeUntil, switchMap } from "rxjs";

/**
 * Component for managing and displaying the form for dataset characteristics.
 */
@Component({
    selector: 'app-dataset-characteristics-form',
    templateUrl: './dataset-characteristics-form.component.html',
    styleUrls: ['./dataset-characteristics-form.component.scss']
})
export class DatasetCharacteristicsFormComponent extends BaseComponent implements OnInit, OnChanges {

    /** The ID of the dataset */
    @Input() datasetId: number;

    /** The characteristic to be edited or created */
    @Input() characteristic: DatasetCharacteristic;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the characteristic */
    characteristicForm: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** List of features associated with the dataset */
    features: any[];

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
        this.loadFeatures();
        this.loadCharacteristic();
    }

    /**
     * Handles changes to input properties.
     * @param changes The changes to input properties
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['characteristic'] && this.characteristic) {
            this.loadCharacteristic();
        }
    }

    /**
     * Loads the features associated with the dataset.
     */
    loadFeatures() {
        this.datasetService.getDatasetById(this.datasetId)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(dataset => this.featureService.getFeaturesByFeatureSetId(dataset.featuresetId))
            )
            .subscribe(features => this.features = features);
    }

    /**
     * Loads the characteristic data into the form.
     */
    loadCharacteristic() {
        if (this.characteristic) {
            this.initializeForm();
        } else {
            this.characteristic = new DatasetCharacteristic({ datasetId: this.datasetId, featureId: null });
            this.initializeForm();
        }
        this.display = true;
    }

    /**
     * Initializes the form group with the characteristic data.
     */
    initializeForm() {
        this.characteristicForm = new FormGroup({
            featureId: new FormControl(this.characteristic.featureId, Validators.required),
            characteristicName: new FormControl(this.characteristic.characteristicName, Validators.required),
            value: new FormControl(this.characteristic.value, Validators.required),
            valueDataType: new FormControl(this.characteristic.valueDataType, Validators.required)
        });
    }

    /**
     * Saves the characteristic, either creating a new one or updating an existing one.
     */
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

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
