import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { SurveyManagementTableComponent } from './survey-management-table.component';
import { RouterModule } from '@angular/router';
import {ChipsModule} from "primeng/chips";
import {DockModule} from "primeng/dock";
import {TranslateModule} from "@ngx-translate/core";
import {SurveyManagementFormModule} from "../survey-management-form/survey-management-form.module";
import {
    SelectedStudyDropdownModule
} from "../../../shared/components/selected-study-dropdown/selected-study-dropdown.module";

@NgModule({
    declarations: [SurveyManagementTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        FormsModule,
        RouterModule,
        ChipsModule,
        DockModule,
        TranslateModule,
        SurveyManagementFormModule,
        SelectedStudyDropdownModule
    ],
    exports: [SurveyManagementTableComponent]
})
export class SurveyManagementTableModule { }
