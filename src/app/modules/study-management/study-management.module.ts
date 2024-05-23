import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyManagementRoutingModule } from "./study-management-routing.module";
import {StudyManagementDashboardModule} from "./study-management-dashboard/study-management-dashboard.module";

@NgModule({
  declarations: [],
  imports: [
    StudyManagementRoutingModule,
    CommonModule,
    StudyManagementDashboardModule
  ]
})
export class StudyManagementModule { }
