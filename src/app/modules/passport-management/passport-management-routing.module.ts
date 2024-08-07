import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PassportManagementTableComponent} from "./passport-management-table/passport-management-table.component";

const routes: Routes = [
    { path: '', component: PassportManagementTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PassportManagementRoutingModule { }
