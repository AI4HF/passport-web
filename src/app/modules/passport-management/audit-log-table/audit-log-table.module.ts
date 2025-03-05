import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {AuditLogTableComponent} from "./audit-log-table.component";
import {CardModule} from "primeng/card";
import {DialogModule} from "primeng/dialog";
import {
    SelectedStudyDropdownModule
} from "../../../shared/components/selected-study-dropdown/selected-study-dropdown.module";
import {TimelineModule} from "primeng/timeline";
import {PaginatorModule} from "primeng/paginator";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CalendarModule} from "primeng/calendar";



@NgModule({
    declarations: [AuditLogTableComponent],
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SharedModule,
        TableModule,
        TooltipModule,
        TranslateModule,
        CardModule,
        DialogModule,
        SelectedStudyDropdownModule,
        TimelineModule,
        PaginatorModule,
        ProgressSpinnerModule,
        CalendarModule
    ],
    exports: [AuditLogTableComponent]
})
export class AuditLogTableModule { }
