import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'organization',
        loadChildren: () => import('./organization-management-edit/organization-management-edit.module').then(m => m.OrganizationManagementEditModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
