import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-creation-step-assignment',
    templateUrl: './creation-step-assignment.component.html',
    styleUrls: ['./creation-step-assignment.component.scss']
})
export class CreationStepAssignmentComponent extends BaseComponent implements OnInit {

    creationStepForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.creationStepForm = new FormGroup({
            stepName: new FormControl('', Validators.required),
            stepDescription: new FormControl('', Validators.required)
        });
    }

    back() {
        // Placeholder for back navigation
    }

    save() {
        // Placeholder for save logic
    }

    addStep() {
        // Placeholder for adding step
    }

    deleteStep(stepName: string) {
        // Placeholder for deleting step
    }
}
