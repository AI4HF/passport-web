import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationManagementRoutingModule } from './organization-management-routing.module';
import { OrganizationModule } from './organization/organization.module';
import { PersonnelModule } from './personnel/personnel.module';

@NgModule({
    imports: [
        CommonModule,
        OrganizationManagementRoutingModule,
        OrganizationModule,
        PersonnelModule
    ]
})
export class OrganizationManagementModule { }
