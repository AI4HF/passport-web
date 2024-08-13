import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningStageParameterAssignmentTableComponent } from './learning-stage-parameter-assignment-table.component';
import { LearningStageParameterAssignmentFormModule } from '../learning-stage-parameter-assignment-form/learning-stage-parameter-assignment-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";
import {
    LearningStageParameterAssignmentFormComponent
} from "../learning-stage-parameter-assignment-form/learning-stage-parameter-assignment-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [LearningStageParameterAssignmentTableComponent, LearningStageParameterAssignmentFormComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningStageParameterAssignmentFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule,
        ReactiveFormsModule,
        DropdownModule
    ],
    exports: [LearningStageParameterAssignmentTableComponent]
})
export class LearningStageParameterAssignmentTableModule { }