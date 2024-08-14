import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningProcessDatasetAssignmentTableComponent } from './learning-process-dataset-assignment-table.component';
import { LearningProcessDatasetAssignmentFormModule } from '../learning-process-dataset-assignment-form/learning-process-dataset-assignment-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [LearningProcessDatasetAssignmentTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningProcessDatasetAssignmentFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule
    ],
    exports: [LearningProcessDatasetAssignmentTableComponent]
})
export class LearningProcessDatasetAssignmentTableModule { }