import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationMeasureTableModule } from './evaluation-measure-table/evaluation-measure-table.module';
import { EvaluationMeasureFormModule } from './evaluation-measure-form/evaluation-measure-form.module';
import { EvaluationMeasureRoutingModule } from './evaluation-measure-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        EvaluationMeasureRoutingModule,
        EvaluationMeasureTableModule,
        EvaluationMeasureFormModule
    ]
})
export class EvaluationMeasureModule { }
