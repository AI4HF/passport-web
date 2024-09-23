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
        this.datasetSteps = [
            { name: this.translateService.instant('DatasetManagement.DatasetDetails'), routerLink: 'dataset-details' },
            { name: this.translateService.instant('DatasetManagement.DatasetCharacteristics'), routerLink: 'dataset-characteristics' },
            { name: this.translateService.instant('DatasetManagement.LearningDatasetCreation'), routerLink: 'learning-dataset-creation' },
            { name: this.translateService.instant('DatasetManagement.TransformationStepAssignment'), routerLink: 'creation-step-assignment' }
        ];
    }
}
