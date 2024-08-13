import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessParameterTableComponent } from './learning-process-parameter-table/learning-process-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: LearningProcessParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningProcessParameterRoutingModule { }
