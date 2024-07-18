import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Feature } from "../../../../../../shared/models/feature.model";
import { takeUntil } from "rxjs";

@Component({
    selector: 'app-featureset-features-form',
    templateUrl: './featureset-features-form.component.html',
    styleUrls: ['./featureset-features-form.component.scss']
})
export class FeatureSetFeaturesFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() selectedFeatureSetId: number;
    @Input() feature: Feature;
    @Output() formClosed = new EventEmitter<void>();

    featureForm: FormGroup;
    display: boolean = false;
    selectedFeature: Feature;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.loadFeature();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['feature'] && this.feature) {
            this.loadFeature();
        }
    }

    loadFeature() {
        if (this.feature) {
            this.selectedFeature = new Feature(this.feature);
            this.initializeForm();
        } else {
            this.selectedFeature = new Feature({});
            this.initializeForm();
        }
        this.display = true;
    }

    initializeForm() {
        this.featureForm = new FormGroup({
            title: new FormControl(this.selectedFeature.title, Validators.required),
            description: new FormControl(this.selectedFeature.description, Validators.required),
            dataType: new FormControl(this.selectedFeature.dataType, Validators.required),
            featureType: new FormControl(this.selectedFeature.featureType, Validators.required),
            mandatory: new FormControl(this.selectedFeature.mandatory),
            isUnique: new FormControl(this.selectedFeature.isUnique),
            units: new FormControl(this.selectedFeature.units),
            equipment: new FormControl(this.selectedFeature.equipment),
            dataCollection: new FormControl(this.selectedFeature.dataCollection)
        });
    }

    saveFeature() {
        if (!this.selectedFeature.featureId) {
            const newFeature: Feature = new Feature({ ...this.featureForm.value, featuresetId: this.selectedFeatureSetId });
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
            const updatedFeature: Feature = new Feature({ featureId: this.selectedFeature.featureId, ...this.featureForm.value });
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

    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
