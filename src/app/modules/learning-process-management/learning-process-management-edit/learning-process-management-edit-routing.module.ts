import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessManagementEditComponent } from './learning-process-management-edit.component';
import { LearningProcessDatasetAssignmentTableComponent } from './learning-process-dataset-and-stage-assignment/learning-process-dataset-assignment/learning-process-dataset-assignment-table/learning-process-dataset-assignment-table.component'
import {
    LearningProcessAndImplementationDetailsComponent
} from "./learning-process-and-implementation-details/learning-process-and-implementation-details.component";
import {
    LearningProcessParameterAssignmentTableComponent
} from "./learning-process-parameter-assignment/learning-process-parameter-assignment-table/learning-process-parameter-assignment-table.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'dataset-details',
                pathMatch: 'full'
            },
            {
                path: 'learning-process-and-implementation-details',
                component: LearningProcessAndImplementationDetailsComponent,
            },
            {
                path: 'learning-process-dataset-assignment',
                component: LearningProcessDatasetAssignmentTableComponent
            },
            {
                path: 'learning-process-parameter-assignment',
                component: LearningProcessParameterAssignmentTableComponent
            }
        ],
        component: LearningProcessManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LearningProcessManagementEditRoutingModule {}