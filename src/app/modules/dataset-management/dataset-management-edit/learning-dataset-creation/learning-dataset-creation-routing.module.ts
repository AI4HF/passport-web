import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningDatasetCreationTableComponent } from './learning-dataset-creation-table/learning-dataset-creation-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningDatasetCreationTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningDatasetCreationRoutingModule { }