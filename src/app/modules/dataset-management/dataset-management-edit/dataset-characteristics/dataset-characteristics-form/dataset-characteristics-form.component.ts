import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatasetCharacteristic } from "../../../../../shared/models/datasetCharacteristic.model";
import { takeUntil, switchMap } from "rxjs";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {HttpClient} from "@angular/common/http";

/**
 * Component for managing and displaying the form for dataset characteristics.
 */
@Component({
    selector: 'app-dataset-characteristics-form',
    templateUrl: './dataset-characteristics-form.component.html',
    styleUrls: ['./dataset-characteristics-form.component.scss']
})
export class DatasetCharacteristicsFormComponent extends BaseComponent implements OnInit {

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

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /** List of characteristics loaded from JSON */
    hardcodedCharacteristics: DatasetCharacteristic[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredCharacteristics: DatasetCharacteristic[] = [];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param http The HTTP client for loading JSON
     */
    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadHardcodedCharacteristics();
        this.isUpdateMode = !!this.characteristic;
        this.initializeForm();
        if (this.isUpdateMode) {
            this.loadFeatureById();
        } else {
            this.characteristic = new DatasetCharacteristic({ datasetId: this.datasetId, featureId: null });
            this.loadFeatures();
        }
        this.display = true;
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
            .subscribe({
                next: features => {
                    this.features = features;
                    this.filterAvailableFeatures();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Filters the features to remove those that are already associated with the dataset.
     * If the filtered list is empty, closes the form and shows an error message.
     */
    filterAvailableFeatures() {
        this.datasetCharacteristicService.getCharacteristicsByDatasetId(this.datasetId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasetCharacteristics => {
                    const usedFeatureIds = datasetCharacteristics.map(characteristic => characteristic.featureId);
                    this.features = this.features.filter(feature => !usedFeatureIds.includes(feature.featureId));

                    if (this.features.length === 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: this.translateService.instant('DatasetManagement.NoAvailableFeatures')
                        });
                        this.closeDialog();
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Loads the feature details using the featureId from the characteristic.
     */
    loadFeatureById() {
        this.featureService.getFeatureById(this.characteristic.featureId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: feature => {
                    this.features = [feature];
                    this.characteristicForm.patchValue({
                        feature: feature
                    });
                    this.updateForm();
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
     * Initializes the form group with the characteristic data.
     */
    initializeForm() {
        this.characteristicForm = new FormGroup({
            feature: new FormControl({ value: '', disabled: false }, this.isUpdateMode ? [] : Validators.required),
            characteristicName: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required),
            valueDataType: new FormControl('', Validators.required)
        });
    }

    /**
     * Updates the form with the loaded characteristic details.
     */
    updateForm() {
        this.characteristicForm.patchValue({
            characteristicName: this.characteristic.characteristicName,
            value: this.characteristic.value,
            valueDataType: this.characteristic.valueDataType
        });
    }

    /**
     * Saves the characteristic, either creating a new one or updating an existing one.
     */
    saveCharacteristic() {
        const formValues = this.characteristicForm.value;
        const characteristicPayload = new DatasetCharacteristic({
            characteristicName: formValues.characteristicName,
            value: formValues.value.toString(),
            valueDataType: formValues.valueDataType,
            datasetId: this.datasetId,
            featureId: this.isUpdateMode ? this.characteristic.featureId : formValues.feature.featureId
        });

        if (this.isUpdateMode) {
            this.datasetCharacteristicService.updateCharacteristic(characteristicPayload)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: characteristic => {
                        this.characteristic = characteristic;
                        this.updateForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DatasetManagement.Updated')
                        });
                        this.closeDialog();
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        } else {
            this.datasetCharacteristicService.createCharacteristic(characteristicPayload)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: characteristic => {
                        this.characteristic = characteristic;
                        this.updateForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DatasetManagement.Created')
                        });
                        this.closeDialog();
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        }
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }

    /**
     * Filters the characteristics based on the input query for auto-fill.
     * @param event The auto-complete complete event
     */
    filterCharacteristics(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredCharacteristics = this.hardcodedCharacteristics.filter(characteristic =>
            characteristic.characteristicName.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills the form with the selected characteristic from the JSON data.
     * Only fills non-dropdown fields.
     * @param event The auto-complete select event
     */
    selectAutoFillCharacteristic(event: any) {
        const selectedCharacteristic = event.value;
        this.characteristicForm.patchValue({
            characteristicName: selectedCharacteristic.characteristicName,
            value: selectedCharacteristic.value,
            valueDataType: selectedCharacteristic.valueDataType
        });
    }

    /**
     * Loads the characteristics from a JSON file for auto-fill functionality.
     */
    loadHardcodedCharacteristics() {
        this.http.get<DatasetCharacteristic[]>('assets/data/example-characteristics.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedCharacteristics = data,
                error: err => console.error('Failed to load dataset characteristics', err)
            });
    }
}

