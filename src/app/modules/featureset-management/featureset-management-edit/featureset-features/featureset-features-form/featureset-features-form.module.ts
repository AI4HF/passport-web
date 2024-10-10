import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FeatureSetFeaturesFormComponent } from './featureset-features-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {
    StudyDetailsModule
} from "../../../../study-management/study-management-edit/study-details/study-details.module";
import {AutoCompleteModule} from "primeng/autocomplete";

@NgModule({
    declarations: [FeatureSetFeaturesFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        StudyDetailsModule,
        AutoCompleteModule
    ],
    exports: [FeatureSetFeaturesFormComponent]
})
export class FeatureSetFeaturesFormModule { }
