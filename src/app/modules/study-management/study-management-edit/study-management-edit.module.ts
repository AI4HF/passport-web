import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudyManagementEditComponent} from "./study-management-edit.component";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TimelineModule} from "primeng/timeline";



@NgModule({
  declarations: [StudyManagementEditComponent],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    TranslateModule,
    ReactiveFormsModule,
    TimelineModule
  ]
})
export class StudyManagementEditModule { }
