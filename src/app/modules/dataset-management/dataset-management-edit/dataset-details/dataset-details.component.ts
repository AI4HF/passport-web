import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil, forkJoin } from "rxjs";
import { Dataset } from "../../../../shared/models/dataset.model";
import { DatasetManagementRoutingModule } from "../../dataset-management-routing.module";

/**
 * Component to display and manage the details of a dataset.
 */
@Component({
    selector: 'app-dataset-details',
    templateUrl: './dataset-details.component.html',
    styleUrls: ['./dataset-details.component.scss']
})
export class DatasetDetailsComponent extends BaseComponent implements OnInit {

    /** The currently selected dataset */
    selectedDataset: Dataset;

    /** The form group for the dataset */
    datasetForm: FormGroup;

    /** List of feature sets */
    featuresets: any[];

    /** List of populations */
    populations: any[];

    /** List of organizations */
    organizations: any[];

    /** Flag to indicate if the form is in edit mode */
    isEditMode: boolean = false;

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

    /**
     * Initializes the form group with the dataset data.
     */
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

    /**
     * Loads the dropdown options for feature sets, populations, and organizations.
     */
    loadDropdowns() {
        forkJoin({
            featuresets: this.featureSetService.getAllFeatureSets(),
            populations: this.populationService.getAllPopulations(),
            organizations: this.organizationService.getAllOrganizations()
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: ({ featuresets, populations, organizations }) => {
                this.featuresets = featuresets;
                this.populations = populations;
                this.organizations = organizations;

                if (this.isEditMode) {
                    this.setDropdownValues();
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
     * Sets the values for the dropdowns based on the selected dataset.
     */
    setDropdownValues() {
        if (this.selectedDataset) {
            this.datasetForm.patchValue({
                featureset: this.featuresets.find(f => f.featuresetId === this.selectedDataset.featuresetId) || null,
                population: this.populations.find(p => p.populationId === this.selectedDataset.populationId) || null,
                organization: this.organizations.find(o => o.id === this.selectedDataset.organizationId) || null
            });
        }
    }

    /**
     * Navigates back to the dataset management page.
     */
    back() {
        this.router.navigate([`${DatasetManagementRoutingModule.route}`]);
    }

    /**
     * Saves the dataset, either creating a new one or updating an existing one.
     */
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
                        this.setDropdownValues();
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
                        this.setDropdownValues();
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
