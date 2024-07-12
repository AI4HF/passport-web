import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-learning-dataset-creation',
    templateUrl: './learning-dataset-creation.component.html',
    styleUrls: ['./learning-dataset-creation.component.scss']
})
export class LearningDatasetCreationComponent extends BaseComponent implements OnInit {

    learningDatasetForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.learningDatasetForm = new FormGroup({
            datasetName: new FormControl('', Validators.required),
            datasetDescription: new FormControl('', Validators.required)
        });
    }

    back() {
        // Placeholder for back navigation
    }

    save() {
        // Placeholder for save logic
    }

    addLearningDataset() {
        // Placeholder for adding learning dataset
    }

    deleteLearningDataset(datasetName: string) {
        // Placeholder for deleting learning dataset
    }
}
