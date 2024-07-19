import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FeatureSet } from "../../../../../shared/models/featureset.model";
import { FeatureSetManagementRoutingModule } from "../../featureset-management-routing.module";
import { Experiment } from "../../../../../shared/models/experiment.model";

/**
 * Component to display and manage the details of a feature set.
 */
@Component({
    selector: 'app-featureset-details',
    templateUrl: './featureset-details.component.html',
    styleUrls: ['./featureset-details.component.scss']
})
export class FeatureSetDetailsComponent extends BaseComponent implements OnInit {

    /** The currently selected feature set */
    selectedFeatureSet: FeatureSet;

    /** The form group for the feature set */
    featureSetForm: FormGroup;

    /** List of experiments */
    experiments: Experiment[] = [];

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
        this.loadExperiments();
        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedFeatureSet = data['featureSet'];
                this.initializeForm();
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
     * Initializes the form group with the feature set data.
     */
    initializeForm() {
        this.featureSetForm = new FormGroup({
            title: new FormControl(this.selectedFeatureSet?.title || '', Validators.required),
            description: new FormControl(this.selectedFeatureSet?.description || '', Validators.required),
            featuresetURL: new FormControl(this.selectedFeatureSet?.featuresetURL || '', Validators.required),
            experiment: new FormControl(this.selectedFeatureSet?.experimentId || null, Validators.required)
        });
    }

    /**
     * Loads the list of experiments.
     */
    loadExperiments() {
        this.experimentService.getAllExperiments().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: experiments => this.experiments = experiments,
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
    }

    /**
     * Navigates back to the feature set management page.
     */
    back() {
        this.router.navigate([`/${FeatureSetManagementRoutingModule.route}`]);
    }

    /**
     * Saves the feature set, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.featureSetForm.value;
        const featureSetPayload = {
            title: formValues.title,
            description: formValues.description,
            featuresetURL: formValues.featuresetURL,
            experimentId: formValues.experiment.experimentId
        };

        if (!this.selectedFeatureSet.featuresetId) {
            const newFeatureSet: FeatureSet = new FeatureSet({ ...featureSetPayload });
            this.featureSetService.createFeatureSet(newFeatureSet)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: featureSet => {
                        this.selectedFeatureSet = featureSet;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('FeatureSetManagement.FeatureSetCreated')
                        });
                        this.router.navigate([`../../${this.selectedFeatureSet.featuresetId}/featureset-features`], { relativeTo: this.route });
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
            const updatedFeatureSet: FeatureSet = new FeatureSet({ featuresetId: this.selectedFeatureSet.featuresetId, ...featureSetPayload });
            this.featureSetService.updateFeatureSet(updatedFeatureSet)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (featureSet: FeatureSet) => {
                        this.selectedFeatureSet = featureSet;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('FeatureSetManagement.FeatureSetUpdated')
                        });
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    },
                });
        }
    }
}
