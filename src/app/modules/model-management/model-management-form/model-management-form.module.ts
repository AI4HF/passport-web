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
    TranslateModule
  ],
  exports: [ModelManagementFormComponent]
})
export class ModelManagementFormModule { }
