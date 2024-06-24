import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'organization',
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule)
    },
    {
        path: 'personnel',
        loadChildren: () => import('./personnel/personnel.module').then(m => m.PersonnelModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
