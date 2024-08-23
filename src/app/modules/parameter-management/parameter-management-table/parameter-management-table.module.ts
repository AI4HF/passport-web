import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParameterManagementTableComponent} from "./parameter-management-table.component";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {ParameterManagementFormModule} from "../parameter-management-form/parameter-management-form.module";
import {
    SelectedStudyDropdownModule
} from "../../../shared/components/selected-study-dropdown/selected-study-dropdown.module";



@NgModule({
  declarations: [ParameterManagementTableComponent],
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SharedModule,
        TableModule,
        TooltipModule,
        TranslateModule,
        ParameterManagementFormModule,
        SelectedStudyDropdownModule,
    ],
  exports: [ParameterManagementTableComponent]
})
export class ParameterManagementTableModule { }
