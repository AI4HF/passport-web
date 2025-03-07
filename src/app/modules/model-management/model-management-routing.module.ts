import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelManagementTableComponent } from './model-management-table/model-management-table.component';
import { ModelParameterTableComponent } from './model-parameter/model-parameter-table/model-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: ModelManagementTableComponent
    },
    {
        path: ':modelId/model-parameter-assignment',
        component: ModelParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelManagementRoutingModule { }