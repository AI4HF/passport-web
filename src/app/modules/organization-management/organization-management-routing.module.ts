import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationManagementComponent } from './organization-management.component';
import { OrganizationComponent } from './organization-main/organization.component';
import { PersonnelComponent } from './personnel/personnel.component';
import {OrganizationPersonnelGuard} from "./personnel/organization-personnel.guard";

const routes: Routes = [
    {
        path: '',
        component: OrganizationManagementComponent,
        children: [
            { path: '', redirectTo: 'organization', pathMatch: 'full' },
            { path: 'organization', component: OrganizationComponent },
            { path: 'personnel',canActivate: [OrganizationPersonnelGuard], component: PersonnelComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }

