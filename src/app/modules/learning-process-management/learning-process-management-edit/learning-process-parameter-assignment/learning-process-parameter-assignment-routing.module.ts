import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessParameterAssignmentTableComponent } from './learning-process-parameter-assignment-table/learning-process-parameter-assignment-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningProcessParameterAssignmentTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningProcessParameterAssignmentRoutingModule { }
