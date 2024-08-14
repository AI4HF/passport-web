import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningStageParameterAssignmentTableComponent } from './learning-stage-parameter-assignment-table/learning-stage-parameter-assignment-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningStageParameterAssignmentTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningStageParameterAssignmentRoutingModule { }