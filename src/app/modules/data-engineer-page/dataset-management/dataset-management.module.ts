import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetManagementRoutingModule } from "./dataset-management-routing.module";
import { DatasetManagementDashboardModule } from "./dataset-management-dashboard/dataset-management-dashboard.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DatasetManagementRoutingModule,
        DatasetManagementDashboardModule
    ]
})
export class DatasetManagementModule { }
