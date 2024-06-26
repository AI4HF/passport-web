import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SurveyInspectionComponent} from "./survey-inspection.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";



@NgModule({
  declarations: [SurveyInspectionComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    RippleModule,
    TranslateModule,
    TableModule,
    TagModule
  ],
  exports: [SurveyInspectionComponent]
})
export class SurveyInspectionModule { }
