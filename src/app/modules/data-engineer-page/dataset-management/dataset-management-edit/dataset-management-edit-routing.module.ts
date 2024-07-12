import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { DatasetCharacteristicsComponent } from './dataset-characteristics/dataset-characteristics.component';
import { CreationStepAssignmentComponent } from './creation-step-assignment/creation-step-assignment.component';
import { LearningDatasetCreationComponent } from './learning-dataset-creation/learning-dataset-creation.component';
import { DatasetManagementEditComponent } from './dataset-management-edit.component';

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
                path: 'dataset-details',
                component: DatasetDetailsComponent,
            },
            {
                path: 'dataset-characteristics',
                component: DatasetCharacteristicsComponent,
            },
            {
                path: 'creation-step-assignment',
                component: CreationStepAssignmentComponent,
            },
            {
                path: 'learning-dataset-creation',
                component: LearningDatasetCreationComponent,
            }
        ],
        component: DatasetManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DatasetManagementEditRoutingModule { }
