import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelManagementTableComponent} from "./model-management-table.component";
import {ModelManagementFormModule} from "../model-management-form/model-management-form.module";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {
    ParameterManagementFormModule
} from "../../parameter-management/parameter-management-form/parameter-management-form.module";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ModelManagementTableComponent],
    imports: [
        CommonModule,
        ModelManagementFormModule,
        ButtonModule,
        InputTextModule,
        ParameterManagementFormModule,
        RippleModule,
        SharedModule,
        TableModule,
        TooltipModule,
        TranslateModule,
        ModelManagementFormModule,
        DropdownModule,
        PaginatorModule,
        ReactiveFormsModule
    ],
  exports: [ModelManagementTableComponent]
})
export class ModelManagementTableModule { }
