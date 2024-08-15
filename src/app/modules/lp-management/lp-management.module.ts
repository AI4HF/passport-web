import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpManagementRoutingModule } from "./lp-management-routing.module";
import { LpManagementDashboardModule } from "./lp-management-dashboard/lp-management-dashboard.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LpManagementRoutingModule,
        LpManagementDashboardModule
    ]
})
export class LpManagementModule { }
