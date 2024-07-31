import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureSetManagementRoutingModule } from "./featureset-management-routing.module";
import { FeatureSetManagementDashboardModule } from "./featureset-management-dashboard/featureset-management-dashboard.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FeatureSetManagementRoutingModule,
        FeatureSetManagementDashboardModule
    ]
})
export class FeatureSetManagementModule { }
