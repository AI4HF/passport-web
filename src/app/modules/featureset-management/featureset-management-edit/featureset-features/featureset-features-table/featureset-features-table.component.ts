import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FeatureSet } from "../../../../../shared/models/featureset.model";
import { Feature } from "../../../../../shared/models/feature.model";
import { takeUntil } from "rxjs";

/**
 * Component to display and manage features within a feature set.
 */
@Component({
    selector: 'app-featureset-features-table',
    templateUrl: './featureset-features-table.component.html',
    styleUrls: ['./featureset-features-table.component.scss']
})
export class FeatureSetFeaturesTableComponent extends BaseComponent implements OnInit {

    /** The currently selected feature set */
    selectedFeatureSet: FeatureSet;

    /** List of features in the selected feature set */
    features: Feature[] = [];

    /** List of outcomes in the selected feature set */
    outcomes: Feature[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The feature ID selected for editing */
    selectedFeatureId: string = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the feature table */
    featureColumns: any[];

    /** Columns to be displayed in the outcome table */
    outcomeColumns: any[];

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
        this.featureColumns = [
            { field: 'featureId', header: 'FeatureSetManagement.FeatureID' },
            { field: 'title', header: 'FeatureSetManagement.FeatureTitle' }
        ];

        this.outcomeColumns = [
            { field: 'featureId', header: 'FeatureSetManagement.OutcomeID' },
            { field: 'title', header: 'FeatureSetManagement.OutcomeTitle' }
        ];

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedFeatureSet = data['featureSet'];
                this.loadFeatures();
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
     * Loads the features of the selected feature set.
     */
    loadFeatures() {
        this.featureService.getFeaturesByFeatureSetId(this.selectedFeatureSet.featuresetId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: features => {
                    this.features = features.filter(feature => !feature.isOutcome);
                    this.outcomes = features.filter(feature => feature.isOutcome);
                    this.loading = false;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Deletes a feature by its ID.
     * @param featureId The ID of the feature to be deleted
     */
    deleteFeature(featureId: string) {
        this.featureService.deleteFeature(featureId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const isFeature = this.features.find(f => f.featureId === featureId);
                    this.features = this.features.filter(f => f.featureId !== featureId);
                    this.outcomes = this.outcomes.filter(o => o.featureId !== featureId);
                    this.translateService.get(['Success', (isFeature ? 'FeatureSetManagement.FeatureDeleted' : 'FeatureSetManagement.OutcomeDeleted')]).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations[(isFeature ? 'FeatureSetManagement.FeatureDeleted' : 'FeatureSetManagement.OutcomeDeleted')]
                        });
                    });
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
     * Displays the form for editing a feature.
     * @param featureId The ID of the feature to be edited
     */
    showFeatureForm(featureId: string) {
        this.selectedFeatureId = featureId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new feature.
     * @param isOutcome whether create an outcome
     */
    createFeature(isOutcome: string) {
        this.selectedFeatureId = isOutcome;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadFeatures();
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


