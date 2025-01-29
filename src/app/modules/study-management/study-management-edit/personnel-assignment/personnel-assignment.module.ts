import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PersonnelAssignmentComponent} from "./personnel-assignment.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {PickListModule} from "primeng/picklist";
import {CheckboxModule} from "primeng/checkbox";
import {StudyDetailsModule} from "../study-details/study-details.module";
import {TableModule} from "primeng/table";



@NgModule({
  declarations: [PersonnelAssignmentComponent],
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PaginatorModule,
        ReactiveFormsModule,
        RippleModule,
        TranslateModule,
        PickListModule,
        CheckboxModule,
        StudyDetailsModule,
        TableModule
    ],
  exports: [PersonnelAssignmentComponent]
})
export class PersonnelAssignmentModule { }
