import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationManagementRoutingModule } from './organization-management-routing.module';
import { PersonnelModule } from './organization-management-edit/personnel/personnel.module';

@NgModule({
    imports: [
        CommonModule,
        OrganizationManagementRoutingModule,
        PersonnelModule
    ]
})
export class OrganizationManagementModule { }
