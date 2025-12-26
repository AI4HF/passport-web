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
import {
    SelectedStudyDropdownModule
} from "../../../shared/components/selected-study-dropdown/selected-study-dropdown.module";
import {ModelFigureGalleryModule} from "../model-figure-gallery/model-figure-gallery.module";
import {
    CascadeValidationDialogModule
} from "../../../shared/components/cascade-validation-dialog/cascade-validation-dialog.module";



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
        ModelFigureGalleryModule,
        CascadeValidationDialogModule,
        DropdownModule,
        PaginatorModule,
        ReactiveFormsModule,
        SelectedStudyDropdownModule
    ],
  exports: [ModelManagementTableComponent]
})
export class ModelManagementTableModule { }
