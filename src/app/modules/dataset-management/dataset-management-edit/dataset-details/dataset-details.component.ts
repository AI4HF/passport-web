import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {forkJoin, takeUntil} from "rxjs";
import { Dataset } from "../../../../shared/models/dataset.model";
import {DatasetManagementRoutingModule} from "../../dataset-management-routing.module";
import {FeatureSet} from "../../../../shared/models/featureset.model";
import {Population} from "../../../../shared/models/population.model";

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
    featuresets: FeatureSet[];
    isEditMode: boolean = false;
    populationOptions: Population[] = [];

    /** List of datasets loaded from JSON */
    hardcodedDatasets: Dataset[] = [];

    /** Filtered list for auto-fill suggestions */
    filteredDatasets: Dataset[] = [];

    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

    ngOnInit() {
        const studyId = this.activeStudyService.getActiveStudy();

        forkJoin({
            featuresets: this.featureSetService.getAllFeatureSetsByStudyId(studyId),
            populations: this.populationService.getPopulationByStudyId(studyId)
        }).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ featuresets, populations }) => {
                    this.featuresets = featuresets;
                    this.populationOptions = populations;

                    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
                        const id = params.get('id');
                        if (id !== 'new') {
                            this.isEditMode = true;
                            this.loadDataset(id);
                        } else {
                            this.selectedDataset = new Dataset({ id: 0 });
                            this.initializeForm();
                        }
                    });
                    this.loadHardcodedDatasets();
                },
                error: (error) => {
                    console.error('Failed to load dropdowns: ', error);

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
    loadDataset(id: string) {
        this.datasetService.getDatasetById(id, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
            next: dataset => {
                this.selectedDataset = dataset;
                this.initializeForm();
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
     * Saves the dataset, either creating a new one or updating an existing one.
     */
    save() {
        const formValues = this.datasetForm.value;
        const datasetPayload = {
            title: formValues.title,
            description: formValues.description,
            version: formValues.version,
            referenceEntity: formValues.referenceEntity,
            featuresetId: formValues.featureset,
            populationId: formValues.population,
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

                        this.translateService.get(['Success', 'DatasetManagement.DatasetCreated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['DatasetManagement.DatasetCreated']
                            });
                        });
                        this.router.navigate([`../../${this.selectedDataset.datasetId}/dataset-characteristics`], { relativeTo: this.route });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
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
                        this.translateService.get(['Success', 'DatasetManagement.DatasetUpdated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['DatasetManagement.DatasetUpdated']
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
