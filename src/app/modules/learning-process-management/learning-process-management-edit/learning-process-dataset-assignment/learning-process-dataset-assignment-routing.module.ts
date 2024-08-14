import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessDatasetAssignmentTableComponent } from './learning-process-dataset-assignment-table/learning-process-dataset-assignment-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningProcessDatasetAssignmentTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningProcessDatasetAssignmentRoutingModule { }