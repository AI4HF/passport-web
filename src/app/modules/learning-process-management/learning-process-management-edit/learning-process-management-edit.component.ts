import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";

/**
 * A controller to edit the details of a LearningProcess object
 */
@Component({
    selector: 'app-learning-process-management-edit',
    templateUrl: './learning-process-management-edit.component.html',
    styleUrls: ['./learning-process-management-edit.component.scss']
})
export class LearningProcessManagementEditComponent extends BaseComponent implements OnInit {

    /**
     * The steps of a learningProcess
     */
    learningProcessSteps: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.learningProcessSteps = [
            { name: this.translateService.instant('LearningProcessManagement.LearningProcessDetails'), routerLink: 'learningProcess-details' },
            { name: this.translateService.instant('LearningProcessManagement.LearningProcessCharacteristics'), routerLink: 'learningProcess-characteristics' },
            { name: this.translateService.instant('LearningProcessManagement.LearningLearningProcessCreation'), routerLink: 'learning-learningProcess-creation' },
            { name: this.translateService.instant('LearningProcessManagement.CreationStepAssignment'), routerLink: 'creation-step-assignment' }
        ];
    }
}
