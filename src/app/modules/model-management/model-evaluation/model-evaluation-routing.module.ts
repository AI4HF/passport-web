import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelEvaluationTableComponent } from './model-evaluation-table/model-evaluation-table.component';

const routes: Routes = [
    {
        path: '',
        component: ModelEvaluationTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelEvaluationRoutingModule { }
