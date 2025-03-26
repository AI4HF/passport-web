import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";

/**
 * A controller to edit the details of a LearningProcess object
 */
@Component({
    selector: 'app-learning-process-management-edit',
    templateUrl: './lp-management-edit.component.html',
    styleUrls: ['./lp-management-edit.component.scss']
})
export class LpManagementEditComponent extends BaseComponent implements OnInit {

    /**
     * The steps of a learningProcess
     */
    learningProcessSteps: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.translateService.get(['LearningProcessManagement.LearningProcessDetails', 'LearningProcessManagement.LearningProcessDataset', 'LearningProcessManagement.LearningStageManagement', 'LearningProcessManagement.LearningProcessParameter']).subscribe(translations => {
            this.learningProcessSteps = [
                {
                    name: translations['LearningProcessManagement.LearningProcessDetails'],
                    routerLink: 'learning-process-and-implementation-details'
                },
                {
                    name: translations['LearningProcessManagement.LearningProcessDataset'],
                    routerLink: 'learning-process-dataset-assignment'
                },
                {
                    name: translations['LearningProcessManagement.LearningStageManagement'],
                    routerLink: 'learning-stage-management'
                },
                {
                    name: translations['LearningProcessManagement.LearningProcessParameter'],
                    routerLink: 'learning-process-parameter-assignment'
                }
            ];
        });
    }
}
