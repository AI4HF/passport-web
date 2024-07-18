import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../../shared/models/dataset.model";
import { DatasetManagementRoutingModule } from "../../dataset-management-routing.module";

/**
 * Shows details of a dataset
 */
@Component({
    selector: 'app-dataset-details',
    templateUrl: './dataset-details.component.html',
    styleUrls: ['./dataset-details.component.scss']
})
export class DatasetDetailsComponent extends BaseComponent implements OnInit {

    selectedDataset: Dataset;
    datasetForm: FormGroup;
    featuresets: any[];
    populations: any[];
    organizations: any[];
    isEditMode: boolean = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedDataset = data['dataset'];
                this.isEditMode = !!this.selectedDataset.datasetId;
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
        this.loadDropdowns();
    }

    initializeForm() {
        this.datasetForm = new FormGroup({
            title: new FormControl(this.selectedDataset?.title || '', Validators.required),
            description: new FormControl(this.selectedDataset?.description || '', Validators.required),
            version: new FormControl(this.selectedDataset?.version || '', Validators.required),
            referenceEntity: new FormControl(this.selectedDataset?.referenceEntity || '', Validators.required),
            featureset: new FormControl(this.selectedDataset?.featuresetId || null, Validators.required),
            population: new FormControl(this.selectedDataset?.populationId || null, Validators.required),
            organization: new FormControl(this.selectedDataset?.organizationId || null, Validators.required),
            numOfRecords: new FormControl(this.selectedDataset?.numOfRecords || 0, Validators.required),
            synthetic: new FormControl(this.selectedDataset?.synthetic || false)
        });
    }

    loadDropdowns() {
        this.featureSetService.getAllFeatureSets().pipe(takeUntil(this.destroy$)).subscribe(featuresets => this.featuresets = featuresets);
        this.populationService.getAllPopulations().pipe(takeUntil(this.destroy$)).subscribe(populations => this.populations = populations);
        this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe(organizations => this.organizations = organizations);
    }

    back() {
        this.router.navigate([`${DatasetManagementRoutingModule.route}`]);
    }

    save() {
        const formValues = this.datasetForm.value;
        const datasetPayload = {
            title: formValues.title,
            description: formValues.description,
            version: formValues.version,
            referenceEntity: formValues.referenceEntity,
            featuresetId: formValues.featureset.featuresetId,
            populationId: formValues.population.populationId,
            organizationId: formValues.organization.id,
            numOfRecords: formValues.numOfRecords,
            synthetic: formValues.synthetic
        };

        if (!this.selectedDataset.datasetId) {
            const newDataset: Dataset = new Dataset({ ...datasetPayload });
            this.datasetService.createDataset(newDataset)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: dataset => {
                        this.selectedDataset = dataset;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DatasetManagement.DatasetCreated')
                        });
                        this.router.navigate([`../../${this.selectedDataset.datasetId}/dataset-characteristics`], { relativeTo: this.route });
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
            const updatedDataset: Dataset = new Dataset({ datasetId: this.selectedDataset.datasetId, ...datasetPayload });
            this.datasetService.updateDataset(updatedDataset)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (dataset: Dataset) => {
                        this.selectedDataset = dataset;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DatasetManagement.DatasetUpdated')
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

