import { HttpClient } from '@angular/common/http';
import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
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

    @Input() selectedFeatureSetId: string;
    @Input() featureId: string;
    @Output() formClosed = new EventEmitter<void>();

    featureForm: FormGroup;
    display: boolean = false;
    selectedFeature: Feature;
    isUpdateMode: boolean = false;

    /** List of features loaded from JSON */
    hardcodedFeatures: Feature[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredFeatures: Feature[] = [];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param http The HTTP client for loading JSON
     */
    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    ngOnInit() {
        this.initializeForm();
        this.loadHardcodedFeatures();

        if (this.featureId && !this.featureId.startsWith('outcome')  && !this.featureId.startsWith('feature')) {
            this.isUpdateMode = true;
            this.loadFeature(this.featureId);
        } else {
            this.selectedFeature = new Feature({});
            this.display = true;
        }
    }

    /**
     * Loads the predefined features from a JSON file for auto-fill functionality.
     */
    loadHardcodedFeatures() {
        this.http.get<Feature[]>('assets/data/example-features.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedFeatures = data,
                error: err => console.error('Failed to load hardcoded features', err)
            });
    }

    /**
     * Initializes the form group with the feature data.
     */
    initializeForm() {
        this.featureForm = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            dataType: new FormControl('', Validators.required),
            isOutcome: new FormControl(this.featureId === "outcome"),
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
    loadFeature(featureId: string) {
        this.featureService.getFeatureById(featureId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: feature => {
                this.selectedFeature = feature;
                this.updateForm();
                this.display = true;
            },
            error: error => {
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
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
            isOutcome: this.selectedFeature.isOutcome,
            mandatory: this.selectedFeature.mandatory,
            isUnique: this.selectedFeature.isUnique,
            units: this.selectedFeature.units,
            equipment: this.selectedFeature.equipment,
            dataCollection: this.selectedFeature.dataCollection
        });
    }

    /**
     * Filters the features based on the title input for auto-fill.
     * @param event The auto-complete event
     */
    filterFeatures(event: any) {
        const query = event.query.toLowerCase();
        this.filteredFeatures = this.hardcodedFeatures.filter(feature =>
            feature.title.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills the form with the selected predefined feature.
     * @param event The auto-complete select event
     */
    selectAutoFill(event: any) {
        const selectedFeature = event.value;
        this.featureForm.patchValue({
            title: selectedFeature.title,
            description: selectedFeature.description,
            dataType: selectedFeature.dataType,
            mandatory: selectedFeature.mandatory,
            isUnique: selectedFeature.isUnique,
            units: selectedFeature.units,
            equipment: selectedFeature.equipment,
            dataCollection: selectedFeature.dataCollection
        });
    }

    /**
     * Saves the feature, either creating a new one or updating an existing one.
     */
    saveFeature() {
        const formValues = this.featureForm.value;
        if (!this.selectedFeature.featureId) {
            const newFeature: Feature = new Feature({ ...formValues, featuresetId: this.selectedFeatureSetId });
            this.featureService.createFeature(newFeature, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: feature => {
                        this.selectedFeature = feature;
                        this.initializeForm();
                        this.translateService.get(['Success', (feature.isOutcome ? 'FeatureSetManagement.OutcomeCreated' : 'FeatureSetManagement.FeatureCreated')]).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations[(feature.isOutcome ? 'FeatureSetManagement.OutcomeCreated' : 'FeatureSetManagement.FeatureCreated')]
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });
        } else {
            const updatedFeature: Feature = new Feature({ featureId: this.selectedFeature.featureId, featuresetId: this.selectedFeatureSetId, ...formValues });
            this.featureService.updateFeature(updatedFeature, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (feature: Feature) => {
                        this.selectedFeature = feature;
                        this.initializeForm();
                        this.translateService.get(['Success', (feature.isOutcome ? 'FeatureSetManagement.OutcomeUpdated' : 'FeatureSetManagement.FeatureUpdated')]).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations[(feature.isOutcome ? 'FeatureSetManagement.OutcomeUpdated' : 'FeatureSetManagement.FeatureUpdated')]
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
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
