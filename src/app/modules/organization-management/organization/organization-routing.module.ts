import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationTableComponent } from './organization-table/organization-table.component';
import { OrganizationFormComponent } from './organization-form/organization-form.component';

const routes: Routes = [
    { path: 'table', component: OrganizationTableComponent },
    { path: 'form/new', component: OrganizationFormComponent },
    { path: 'form/:id', component: OrganizationFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }
