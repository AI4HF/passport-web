import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../shared/components/base.component";
import { FeatureSet } from "../../../../../../shared/models/featureset.model";
import { Feature } from "../../../../../../shared/models/feature.model";
import { FeatureService } from "../../../../../../core/services/feature.service";
import { takeUntil } from "rxjs";

@Component({
    selector: 'app-featureset-features-table',
    templateUrl: './featureset-features-table.component.html',
    styleUrls: ['./featureset-features-table.component.scss']
})
export class FeatureSetFeaturesTableComponent extends BaseComponent implements OnInit {

    selectedFeatureSet: FeatureSet;
    features: Feature[] = [];
    displayForm: boolean = false;
    selectedFeature: Feature = null;
    loading: boolean = true;
    columns: any[];

    constructor(protected injector: Injector, private featureService: FeatureService) {
        super(injector);
    }

    ngOnInit() {
        this.columns = [
            { field: 'featureId', header: 'FeatureSetManagement.FeatureID' },
            { field: 'title', header: 'FeatureSetManagement.FeatureTitle' }
        ];

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedFeatureSet = data['featureSet'];
                this.loadFeatures();
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

    loadFeatures() {
        this.featureService.getFeaturesByFeatureSetId(this.selectedFeatureSet.featuresetId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: features => {
                    this.features = features;
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

    deleteFeature(featureId: number) {
        this.featureService.deleteFeature(featureId).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.features = this.features.filter(f => f.featureId !== featureId);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('FeatureSetManagement.FeatureDeleted')
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

    showFeatureForm(feature: Feature) {
        this.selectedFeature = feature;
        this.displayForm = true;
    }

    createFeature() {
        this.selectedFeature = null;
        this.displayForm = true;
    }

    onFormClosed() {
        this.displayForm = false;
        this.loadFeatures();
    }

    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

