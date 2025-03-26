import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";

/**
 * A controller to edit the details of a Dataset object
 */
@Component({
    selector: 'app-dataset-management-edit',
    templateUrl: './dataset-management-edit.component.html',
    styleUrls: ['./dataset-management-edit.component.scss']
})
export class DatasetManagementEditComponent extends BaseComponent implements OnInit {

    /**
     * The steps of a dataset
     */
    datasetSteps: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }


    ngOnInit() {
        this.translateService.get(['DatasetManagement.DatasetDetails', 'DatasetManagement.DatasetCharacteristics', 'DatasetManagement.LearningDatasetCreation', 'DatasetManagement.TransformationStepAssignment']).subscribe(translations => {
            this.datasetSteps = [
                {
                    name: translations['DatasetManagement.DatasetDetails'],
                    routerLink: 'dataset-details'
                },
                {
                    name: translations['DatasetManagement.DatasetCharacteristics'],
                    routerLink: 'dataset-characteristics'
                },
                {
                    name: translations['DatasetManagement.LearningDatasetCreation'],
                    routerLink: 'learning-dataset-creation'
                },
                {
                    name: translations['DatasetManagement.TransformationStepAssignment'],
                    routerLink: 'creation-step-assignment'
                }
            ];
        });
    }
}
