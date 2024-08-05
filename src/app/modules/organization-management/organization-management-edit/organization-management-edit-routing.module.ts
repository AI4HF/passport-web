import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import {OrganizationManagementEditComponent} from "./organization-management-edit.component";

const routes: Routes = [
    {
        path: '',
        component: OrganizationManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrganizationManagementEditRoutingModule { }