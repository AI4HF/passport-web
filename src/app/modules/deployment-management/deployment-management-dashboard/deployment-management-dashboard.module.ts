import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeploymentManagementDashboardComponent} from "./deployment-management-dashboard.component";
import {TranslateModule} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {TableModule} from "primeng/table";



@NgModule({
    declarations: [DeploymentManagementDashboardComponent],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        TableModule
    ]
})
export class DeploymentManagementDashboardModule { }
