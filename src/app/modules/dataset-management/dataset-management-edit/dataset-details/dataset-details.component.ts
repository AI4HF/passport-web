import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { Dataset } from "../../../../shared/models/dataset.model";
import {DatasetManagementRoutingModule} from "../../dataset-management-routing.module";

/**
 * Component to display and manage the details of a dataset.
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
    isEditMode: boolean = false;
    populationOptions: any[] = [];

    /** List of datasets loaded from JSON */
    hardcodedDatasets: Dataset[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredDatasets: Dataset[] = [];

    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    ngOnInit() {
        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const id = params.get('id');
            if (id !== 'new') {
                this.isEditMode = true;
                this.loadDataset(+id);
            } else {
                this.selectedDataset = new Dataset({ id: 0 });
                this.initializeForm();
            }
        });
        this.loadDropdowns();
        this.loadHardcodedDatasets();
    }

    /**
     * Loads the predefined datasets from a JSON file for auto-fill functionality.
     */
    loadHardcodedDatasets() {
        this.http.get<Dataset[]>('assets/data/example-datasets.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedDatasets = data,
                error: err => console.error('Failed to load hardcoded datasets', err)
            });
    }

    /**
     * Loads the Dataset details by id if entity is being edited.
     */
    loadDataset(id: number) {
        this.datasetService.getDatasetById(id, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: dataset => {
                this.selectedDataset = dataset;
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
     * Initializes the form group with the dataset data.
     */
    initializeForm() {
        this.datasetForm = new FormGroup({
            title: new FormControl(this.selectedDataset?.title || '', Validators.required),
            description: new FormControl(this.selectedDataset?.description || '', Validators.required),
            version: new FormControl(this.selectedDataset?.version || '', Validators.required),
            referenceEntity: new FormControl(this.selectedDataset?.referenceEntity || '', Validators.required),
            featureset: new FormControl(this.selectedDataset?.featuresetId || null, Validators.required),
            population: new FormControl(this.selectedDataset?.populationId || null, Validators.required), // Initialize Population Field
            numOfRecords: new FormControl(this.selectedDataset?.numOfRecords || 0, Validators.required),
            synthetic: new FormControl(this.selectedDataset?.synthetic || false)
        });

        if (this.isEditMode) {
            this.setDropdownValues();
        }
    }


    /**
     * Filters the datasets based on the title input for auto-fill.
     * @param event The auto-complete event
     */
    filterDatasets(event: any) {
        const query = event.query.toLowerCase();
        this.filteredDatasets = this.hardcodedDatasets.filter(dataset =>
            dataset.title.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills the form with the selected predefined dataset.
     * @param event The auto-complete select event
     */
    selectAutoFill(event: any) {
        const selectedDataset = event.value;
        this.datasetForm.patchValue({
            title: selectedDataset.title,
            description: selectedDataset.description,
            version: selectedDataset.version,
            referenceEntity: selectedDataset.referenceEntity,
            numOfRecords: selectedDataset.numOfRecords,
            synthetic: selectedDataset.synthetic
        });
    }

    /**
     * Loads the dropdown options for feature sets, populations, and organizations.
     */
    loadDropdowns() {
        this.featureSetService.getAllFeatureSetsByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: (featuresets) => {
                this.featuresets = featuresets;
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
        this.loadPopulations();
    }

    /**
     * Fetch available populations based on current study ID.
     */
    loadPopulations() {
        const studyId = this.activeStudyService.getActiveStudy();
        this.populationService.getPopulationByStudyId(+studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (populations) => {
                    this.populationOptions = populations;
                    console.log(this.populationOptions);
                },
                error: (err) => {
                    console.error('Failed to load populations: ', err);
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
                population: this.populationOptions.find(p => p.populationId === this.selectedDataset.populationId) || null
            });
        }
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
            numOfRecords: formValues.numOfRecords,
            synthetic: formValues.synthetic
        };

        if (!this.selectedDataset.datasetId) {
            const newDataset: Dataset = new Dataset({ ...datasetPayload });
            this.datasetService.createDataset(newDataset, this.activeStudyService.getActiveStudy())
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
            this.datasetService.updateDataset(updatedDataset, this.activeStudyService.getActiveStudy())
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
                    }
                });
        }
    }

    /**
     * Navigates back to the dataset management page.
     */
    back() {
        this.router.navigate([`${DatasetManagementRoutingModule.route}`]);
    }
}
