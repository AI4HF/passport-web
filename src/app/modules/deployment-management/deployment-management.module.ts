import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentManagementRoutingModule } from "./deployment-management-routing.module";
import {DeploymentManagementDashboardModule} from "./deployment-management-dashboard/deployment-management-dashboard.module";
import {DeploymentManagementEditModule} from "./deployment-management-edit/deployment-management-edit.module";

@NgModule({
    declarations: [],
    imports: [
        DeploymentManagementRoutingModule,
        CommonModule,
        DeploymentManagementDashboardModule,
        DeploymentManagementEditModule
    ]
})
export class DeploymentManagementModule { }
