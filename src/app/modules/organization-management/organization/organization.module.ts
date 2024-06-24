import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationTableModule } from './organization-table/organization-table.module';
import { OrganizationFormModule } from './organization-form/organization-form.module';
import {OrganizationRoutingModule} from "./organization-routing.module";

@NgModule({
    imports: [
        CommonModule,
        OrganizationTableModule,
        OrganizationFormModule,
        OrganizationRoutingModule
    ]
})
export class OrganizationModule { }
