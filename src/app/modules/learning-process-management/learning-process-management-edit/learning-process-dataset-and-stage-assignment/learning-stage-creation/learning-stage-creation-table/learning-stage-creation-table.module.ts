import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningStageCreationTableComponent } from './learning-stage-creation-table.component';
import { LearningStageCreationFormModule } from '../learning-stage-creation-form/learning-stage-creation-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [LearningStageCreationTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningStageCreationFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule
    ],
    exports: [LearningStageCreationTableComponent]
})
export class LearningStageCreationTableModule { }