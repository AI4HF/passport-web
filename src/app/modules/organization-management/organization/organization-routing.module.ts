import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationTableComponent } from './organization-table/organization-table.component';

const routes: Routes = [
    { path: '', component: OrganizationTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }
