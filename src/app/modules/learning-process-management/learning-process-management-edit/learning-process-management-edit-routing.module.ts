import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessManagementEditComponent } from './learning-process-management-edit.component';
import { LearningProcessDatasetAssignmentTableComponent } from './learning-process-dataset-assignment/learning-process-dataset-assignment-table/learning-process-dataset-assignment-table.component';
import { LearningStageCreationTableComponent } from './learning-stage-creation/learning-stage-creation-table/learning-stage-creation-table.component';
import {
    LearningProcessAndImplementationDetailsComponent
} from "./learning-process-and-implementation-details/learning-process-and-implementation-details.component";
import {
    LearningProcessParameterTableComponent
} from "./lp-parameter/learning-process-parameter-table/learning-process-parameter-table.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'learning-process-and-implementation-details',
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
                path: 'learning-stage-management',
                loadChildren: () => import('./learning-stage-creation/learning-stage-creation.module').then(m => m.LearningStageCreationModule)
            },
            {
                path: 'learning-process-parameter-assignment',
                component: LearningProcessParameterTableComponent
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
