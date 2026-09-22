import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelEvaluationTableModule } from './model-evaluation-table/model-evaluation-table.module';
import { ModelEvaluationFormModule } from './model-evaluation-form/model-evaluation-form.module';
import { EvaluationMeasureFormModule } from './evaluation-measure-form/evaluation-measure-form.module';
import { ModelEvaluationRoutingModule } from './model-evaluation-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ModelEvaluationRoutingModule,
        ModelEvaluationTableModule,
        ModelEvaluationFormModule,
        EvaluationMeasureFormModule
    ]
})
export class ModelEvaluationModule { }
