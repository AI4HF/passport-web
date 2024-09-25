import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelManagementFormComponent} from "./model-management-form.component";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {StudyDetailsModule} from "../../study-management/study-management-edit/study-details/study-details.module";
import {AutoCompleteModule} from "primeng/autocomplete";



@NgModule({
  declarations: [ModelManagementFormComponent],
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        PaginatorModule,
        ReactiveFormsModule,
        TranslateModule,
        StudyDetailsModule,
        AutoCompleteModule
    ],
  exports: [ModelManagementFormComponent]
})
export class ModelManagementFormModule { }
