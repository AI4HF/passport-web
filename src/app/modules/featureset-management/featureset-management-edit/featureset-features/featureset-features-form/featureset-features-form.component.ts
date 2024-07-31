import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Feature } from "../../../../../shared/models/feature.model";
import { takeUntil } from "rxjs";

/**
 * Component for managing feature forms within a feature set.
 */
@Component({
    selector: 'app-featureset-features-form',
    templateUrl: './featureset-features-form.component.html',
    styleUrls: ['./featureset-features-form.component.scss']
})
export class FeatureSetFeaturesFormComponent extends BaseComponent implements OnInit {

    /** The ID of the selected feature set */
    @Input() selectedFeatureSetId: number;

    /** The ID of the feature to be edited or created */
    @Input() featureId: number;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the feature */
    featureForm: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The feature being edited or created */
    selectedFeature: Feature;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

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
        this.initializeForm();
        if (this.featureId) {
            this.isUpdateMode = true;
            this.loadFeature(this.featureId);
        } else {
            this.selectedFeature = new Feature({});
            this.display = true;
        }
    }

    /**
     * Initializes the form group with the feature data.
     */
    initializeForm() {
        this.featureForm = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            dataType: new FormControl('', Validators.required),
            featureType: new FormControl('', Validators.required),
            mandatory: new FormControl(false),
            isUnique: new FormControl(false),
            units: new FormControl(''),
            equipment: new FormControl(''),
            dataCollection: new FormControl('')
        });
    }

    /**
     * Loads the feature data by ID and updates the form.
     * @param featureId The ID of the feature to be loaded
     */
    loadFeature(featureId: number) {
        this.featureService.getFeatureById(featureId).pipe(takeUntil(this.destroy$)).subscribe({
            next: feature => {
                this.selectedFeature = feature;
                this.updateForm();
                this.display = true;
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
     * Updates the form with the loaded feature details.
     */
    updateForm() {
        this.featureForm.patchValue({
            title: this.selectedFeature.title,
            description: this.selectedFeature.description,
            dataType: this.selectedFeature.dataType,
            featureType: this.selectedFeature.featureType,
            mandatory: this.selectedFeature.mandatory,
            isUnique: this.selectedFeature.isUnique,
            units: this.selectedFeature.units,
            equipment: this.selectedFeature.equipment,
            dataCollection: this.selectedFeature.dataCollection
        });
    }

    /**
     * Saves the feature, either creating a new one or updating an existing one.
     */
    saveFeature() {
        const formValues = this.featureForm.value;
        if (!this.selectedFeature.featureId) {
            const newFeature: Feature = new Feature({ ...formValues, featuresetId: this.selectedFeatureSetId });
            this.featureService.createFeature(newFeature)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: feature => {
                        this.selectedFeature = feature;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('FeatureSetManagement.FeatureCreated')
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
        } else {
            const updatedFeature: Feature = new Feature({ featureId: this.selectedFeature.featureId, featuresetId: this.selectedFeatureSetId, ...formValues });
            this.featureService.updateFeature(updatedFeature)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (feature: Feature) => {
                        this.selectedFeature = feature;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('FeatureSetManagement.FeatureUpdated')
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
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
