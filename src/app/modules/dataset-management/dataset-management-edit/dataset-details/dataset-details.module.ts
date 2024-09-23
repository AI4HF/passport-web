import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetDetailsComponent } from './dataset-details.component';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { CardModule } from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {StudyDetailsModule} from "../../../study-management/study-management-edit/study-details/study-details.module";

@NgModule({
    declarations: [DatasetDetailsComponent],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        CardModule,
        CheckboxModule,
        DropdownModule,
        StudyDetailsModule
    ]
})
export class DatasetDetailsModule { }
