import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpManagementDashboardComponent } from './lp-management-dashboard.component';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import {
    SelectedStudyDropdownModule
} from "../../../shared/components/selected-study-dropdown/selected-study-dropdown.module";
import {
    CascadeValidationDialogModule
} from "../../../shared/components/cascade-validation-dialog/cascade-validation-dialog.module";

@NgModule({
    declarations: [LpManagementDashboardComponent],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        TableModule,
        SelectedStudyDropdownModule,
        CascadeValidationDialogModule
    ]
})
export class LpManagementDashboardModule { }
