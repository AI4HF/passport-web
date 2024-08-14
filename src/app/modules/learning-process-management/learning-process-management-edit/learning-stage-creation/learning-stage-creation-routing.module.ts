import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningStageCreationTableComponent } from './learning-stage-creation-table/learning-stage-creation-table.component';
import { LearningStageParameterAssignmentTableComponent } from './learning-stage-parameter-assignment/learning-stage-parameter-assignment-table/learning-stage-parameter-assignment-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningStageCreationTableComponent
    },
    {
        path: ':learningStageId/learning-stage-parameter-assignment',
        component: LearningStageParameterAssignmentTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningStageCreationRoutingModule { }
