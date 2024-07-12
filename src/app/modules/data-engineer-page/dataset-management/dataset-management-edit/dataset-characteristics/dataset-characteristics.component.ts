import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-dataset-characteristics',
    templateUrl: './dataset-characteristics.component.html',
    styleUrls: ['./dataset-characteristics.component.scss']
})
export class DatasetCharacteristicsComponent extends BaseComponent implements OnInit {

    characteristicsForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.characteristicsForm = new FormGroup({
            characteristicName: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required),
            valueDataType: new FormControl('', Validators.required)
        });
    }

    back() {
        // Placeholder for back navigation
    }

    save() {
        // Placeholder for save logic
    }

    addCharacteristic() {
        // Placeholder for adding characteristic
    }

    deleteCharacteristic(characteristicName: string) {
        // Placeholder for deleting characteristic
    }
}
