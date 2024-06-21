import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationComponent } from './organization/organization.component';
import { PersonnelComponent } from './personnel/personnel.component';

const routes: Routes = [
    { path: 'organization', component: OrganizationComponent },
    { path: 'personnel', component: PersonnelComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }



