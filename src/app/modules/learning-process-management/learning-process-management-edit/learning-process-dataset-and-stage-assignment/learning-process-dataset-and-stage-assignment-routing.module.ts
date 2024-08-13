import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessDatasetAssignmentTableComponent } from './learning-process-dataset-assignment/learning-process-dataset-assignment-table/learning-process-dataset-assignment-table.component';
import { LearningStageCreationTableComponent } from './learning-stage-creation/learning-stage-creation-table/learning-stage-creation-table.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'learning-process-dataset-assignment',
                component: LearningProcessDatasetAssignmentTableComponent
            },
            {
                path: 'learning-dataset-creation',
                component: LearningStageCreationTableComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningProcessDatasetAndStageAssignmentRoutingModule {}