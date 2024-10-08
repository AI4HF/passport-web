import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParameterManagementFormComponent} from "./parameter-management-form.component";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {StudyDetailsModule} from "../../study-management/study-management-edit/study-details/study-details.module";



@NgModule({
  declarations: [ParameterManagementFormComponent],
    imports: [
        CommonModule,
        AutoCompleteModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        PaginatorModule,
        ReactiveFormsModule,
        TranslateModule,
        StudyDetailsModule
    ],
  exports: [ParameterManagementFormComponent]
})
export class ParameterManagementFormModule { }
