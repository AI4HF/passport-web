import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from "primeng/ripple";
import { TranslateModule } from "@ngx-translate/core";
import { ModelEvaluationTableComponent } from './model-evaluation-table.component';
import { ModelEvaluationFormModule } from '../model-evaluation-form/model-evaluation-form.module';
import { EvaluationMeasureFormModule } from '../evaluation-measure-form/evaluation-measure-form.module';

@NgModule({
    declarations: [ModelEvaluationTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        InputTextModule,
        RippleModule,
        TranslateModule,
        ModelEvaluationFormModule,
        EvaluationMeasureFormModule
    ],
    exports: [ModelEvaluationTableComponent]
})
export class ModelEvaluationTableModule { }
