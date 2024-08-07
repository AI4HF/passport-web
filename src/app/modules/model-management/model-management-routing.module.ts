import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModelManagementTableComponent} from "./model-management-table/model-management-table.component";


const routes: Routes = [
    { path: '', component:  ModelManagementTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelManagementRoutingModule { }