import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationMeasureTableComponent } from './evaluation-measure-table/evaluation-measure-table.component';

const routes: Routes = [
    {
        path: '',
        component: EvaluationMeasureTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EvaluationMeasureRoutingModule { }
