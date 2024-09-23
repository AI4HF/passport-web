import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureSetDetailsComponent } from './featureset-details.component';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule } from "@angular/forms";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DropdownModule} from "primeng/dropdown";
import {StudyDetailsModule} from "../../../study-management/study-management-edit/study-details/study-details.module";

@NgModule({
    declarations: [FeatureSetDetailsComponent],
    exports: [
        FeatureSetDetailsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        StudyDetailsModule
    ]
})
export class FeatureSetDetailsModule { }
