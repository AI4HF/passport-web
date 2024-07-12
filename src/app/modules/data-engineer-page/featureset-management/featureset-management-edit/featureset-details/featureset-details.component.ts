import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FeatureSet } from "../../../../../shared/models/featureset.model";
import { FeatureSetService } from "../../../../../core/services/featureset.service";
import { FeatureSetManagementRoutingModule } from "../../featureset-management-routing.module";
import { Experiment } from "../../../../../shared/models/experiment.model";

/**
 * Shows details of a feature set
 */
@Component({
    selector: 'app-featureset-details',
    templateUrl: './featureset-details.component.html',
    styleUrls: ['./featureset-details.component.scss']
})
export class FeatureSetDetailsComponent extends BaseComponent implements OnInit {

    /**
     * The selected feature set for the component
     */
    selectedFeatureSet: FeatureSet;

    /**
     * The form object keeping the feature set information.
     */
    featureSetForm: FormGroup;

    experiments: Experiment[] = [];

    constructor(protected injector: Injector, private featureSetService: FeatureSetService) {
        super(injector);
    }

    ngOnInit() {
        this.loadExperiments();
        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedFeatureSet = data['featureSet'];
                console.log(this.selectedFeatureSet);
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
     * Initializes the form object for the given feature set.
     */
    initializeForm() {
        this.featureSetForm = new FormGroup({
            title: new FormControl(this.selectedFeatureSet?.title || '', Validators.required),
            description: new FormControl(this.selectedFeatureSet?.description || '', Validators.required),
            featuresetURL: new FormControl(this.selectedFeatureSet?.featuresetURL || '', Validators.required),
            experiment: new FormControl({
                value: this.selectedFeatureSet?.experimentId || null,
                disabled: !!this.selectedFeatureSet.featuresetId
            }, Validators.required)
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
     * Back to feature set management menu
     */
    back() {
        this.router.navigate([`/${FeatureSetManagementRoutingModule.route}`]);
    }

    /**
     * Save feature set details
     */
    save() {
        if (!this.selectedFeatureSet.featuresetId) {
            const newFeatureSet: FeatureSet = new FeatureSet({ ...this.featureSetForm.value });
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
            const updatedFeatureSet: FeatureSet = new FeatureSet({ featuresetId: this.selectedFeatureSet.featuresetId, ...this.featureSetForm.value });
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
