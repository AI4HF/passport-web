import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessManagementRoutingModule } from "./learning-process-management-routing.module";
import { LearningProcessManagementDashboardModule } from "./learning-process-management-dashboard/learning-process-management-dashboard.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningProcessManagementRoutingModule,
        LearningProcessManagementDashboardModule
    ]
})
export class LearningProcessManagementModule { }
