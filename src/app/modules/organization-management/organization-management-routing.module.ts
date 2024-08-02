import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {organizationPersonnelGuard} from "../../core/guards/organization-personnel.guard";

const routes: Routes = [
    {
        path: 'organization',
        loadChildren: () => import('./organization-management-edit/organization-management-edit.module').then(m => m.OrganizationManagementEditModule)
    },
    {
        path: 'personnel',
        loadChildren: () => import('./personnel/personnel.module').then(m => m.PersonnelModule),
        canActivate: [organizationPersonnelGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
