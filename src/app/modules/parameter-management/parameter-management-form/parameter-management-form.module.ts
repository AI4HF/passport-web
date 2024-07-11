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
    TranslateModule
  ],
  exports: [ParameterManagementFormComponent]
})
export class ParameterManagementFormModule { }
