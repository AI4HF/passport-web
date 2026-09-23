import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrganizationManagementEditComponent} from "./organization-management-edit.component";
import {OrganizationDetailsModule} from "./organization-details/organization-details.module";
import {OrganizationManagementEditRoutingModule} from "./organization-management-edit-routing.module";
import {PersonnelTableModule} from "./personnel/personnel-table/personnel-table.module";
import {SoftwareAgentTableModule} from "./software-agent/software-agent-table/software-agent-table.module";



@NgModule({
  declarations: [OrganizationManagementEditComponent],
  imports: [
    CommonModule,
    OrganizationDetailsModule,
    OrganizationManagementEditRoutingModule,
    PersonnelTableModule,
    SoftwareAgentTableModule
  ]
})
export class OrganizationManagementEditModule { }
