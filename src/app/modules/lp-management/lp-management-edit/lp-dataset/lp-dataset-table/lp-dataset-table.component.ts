import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { LearningDataset } from '../../../../../shared/models/learningDataset.model';
import { takeUntil } from 'rxjs';
import {
    LearningProcessDatasetWithDescriptionModel
} from "../../../../../shared/models/learningProcessDatasetWithDescription.model";

/**
 * Component for managing and displaying the learning process datasets assignment table.
 */
@Component({
    selector: 'app-learning-process-dataset-assignment-table',
    templateUrl: './lp-dataset-table.component.html',
    styleUrls: ['./lp-dataset-table.component.scss']
})
export class LpDatasetTableComponent extends BaseComponent implements OnInit {

    /** The ID of the learning process */
    learningProcessId: string;

    /** List of learning process datasets with descriptions */
    learningProcessDatasetsWithDescriptions: Array<LearningProcessDatasetWithDescriptionModel> = [];

    /** List of all learning datasets */
    learningDatasets: LearningDataset[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The IDs of the selected learning process dataset for editing */
    selectedLearningProcessId: string;
    selectedLearningDatasetId: string;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

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
        this.columns = [
            { field: 'description', header: 'LearningProcessManagement.Description' },
            { field: 'learningDatasetDescription', header: 'LearningProcessManagement.LearningDataset' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.learningProcessId = params.get('id');
            this.loadLearningDatasets();
        });
    }

    /**
     * Loads the learning datasets and then loads the learning process datasets.
     */
    loadLearningDatasets() {
        this.learningDatasetService.getAllLearningDatasetsByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: datasets => {
                    this.learningDatasets = datasets;
                    this.loadLearningProcessDatasets();
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
     * Loads the learning process datasets and maps them with the learning dataset descriptions.
     */
    loadLearningProcessDatasets() {
        this.learningProcessDatasetService.getLearningProcessDatasetsByLearningProcessId(this.learningProcessId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: learningProcessDatasets => {
                    this.learningProcessDatasetsWithDescriptions = learningProcessDatasets.map(lpd => new LearningProcessDatasetWithDescriptionModel(lpd, this.getLearningDatasetDescription(lpd.learningDatasetId), lpd.description));
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
     * Gets the description of a learning dataset by its ID.
     * @param learningDatasetId The ID of the learning dataset
     * @returns The description of the learning dataset
     */
    getLearningDatasetDescription(learningDatasetId: string): string {
        const dataset = this.learningDatasets.find(ld => ld.learningDatasetId === learningDatasetId);
        return dataset ? dataset.description : '';
    }

    /**
     * Deletes a learning process dataset by its composite key (learningProcessId and learningDatasetId).
     * @param learningProcessDataset The learning process dataset to be deleted
     */
    deleteLearningProcessDataset(learningProcessDataset: any) {
        this.learningProcessDatasetService.deleteLearningProcessDataset(
            learningProcessDataset.learningProcessDataset.learningProcessId,
            learningProcessDataset.learningProcessDataset.learningDatasetId,
            this.activeStudyService.getActiveStudy()
        ).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.learningProcessDatasetsWithDescriptions = this.learningProcessDatasetsWithDescriptions.filter(
                        lpd => !(lpd.learningProcessDataset.learningProcessId === learningProcessDataset.learningProcessId && lpd.learningProcessDataset.learningDatasetId === learningProcessDataset.learningDatasetId)

                    );
                    this.translateService.get(['Success', 'LearningProcessManagement.Deleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['LearningProcessManagement.Deleted']
                        });
                    });
                    this.loadLearningProcessDatasets();
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
     * Displays the form for editing a learning process dataset.
     * @param learningProcessDatasetWithDescriptions The learning process dataset to be edited
     */
    showLearningProcessDatasetForm(learningProcessDatasetWithDescriptions: any) {
        this.selectedLearningProcessId = learningProcessDatasetWithDescriptions.learningProcessDataset.learningProcessId;
        this.selectedLearningDatasetId = learningProcessDatasetWithDescriptions.learningProcessDataset.learningDatasetId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new learning process dataset.
     */
    createLearningProcessDataset() {
        this.selectedLearningProcessId = this.learningProcessId;
        this.selectedLearningDatasetId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadLearningProcessDatasets();
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
