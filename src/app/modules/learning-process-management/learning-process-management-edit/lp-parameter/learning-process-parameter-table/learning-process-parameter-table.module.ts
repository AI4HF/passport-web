import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningProcessParameterTableComponent } from './learning-process-parameter-table.component';
import { LearningProcessParameterFormModule } from '../lp-parameter-form/learning-process-parameter-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [LearningProcessParameterTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningProcessParameterFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule
    ],
    exports: [LearningProcessParameterTableComponent]
})
export class LearningProcessParameterTableModule { }