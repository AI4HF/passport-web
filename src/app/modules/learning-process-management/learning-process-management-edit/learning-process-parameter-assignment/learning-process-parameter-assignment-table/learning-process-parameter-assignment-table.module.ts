import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningProcessParameterAssignmentTableComponent } from './learning-process-parameter-assignment-table.component';
import { LearningProcessParameterAssignmentFormModule } from '../learning-process-parameter-assignment-form/learning-process-parameter-assignment-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [LearningProcessParameterAssignmentTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningProcessParameterAssignmentFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule
    ],
    exports: [LearningProcessParameterAssignmentTableComponent]
})
export class LearningProcessParameterAssignmentTableModule { }