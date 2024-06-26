import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExperimentQuestionsComponent} from "./experiment-questions.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {PickListModule} from "primeng/picklist";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TranslateModule} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";



@NgModule({
  declarations: [ExperimentQuestionsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    PickListModule,
    RippleModule,
    SharedModule,
    TranslateModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule
  ],
  exports: [ExperimentQuestionsComponent]
})
export class ExperimentQuestionsModule { }
