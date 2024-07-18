import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { DatasetCharacteristicsTableComponent } from './dataset-characteristics/dataset-characteristics-table/dataset-characteristics-table.component';
import { CreationStepAssignmentTableComponent } from './creation-step-assignment/creation-step-assignment-table/creation-step-assignment-table.component';
import { LearningDatasetCreationTableComponent } from './learning-dataset-creation/learning-dataset-creation-table/learning-dataset-creation-table.component';
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
                component: DatasetCharacteristicsTableComponent,
            },
            {
                path: 'creation-step-assignment',
                component: CreationStepAssignmentTableComponent,
            },
            {
                path: 'learning-dataset-creation',
                component: LearningDatasetCreationTableComponent,
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
