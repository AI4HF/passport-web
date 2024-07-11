import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ParameterManagementTableComponent} from "./parameter-management-table/parameter-management-table.component";

const routes: Routes = [
    { path: '', component: ParameterManagementTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParameterManagementRoutingModule { }
