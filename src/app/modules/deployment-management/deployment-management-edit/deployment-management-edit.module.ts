import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeploymentManagementEditComponent} from "./deployment-management-edit.component";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TimelineModule} from "primeng/timeline";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {StepperModule} from "../../../shared/components/stepper/stepper.module";
import {DeploymentManagementEditRoutingModule} from "./deployment-management-edit-routing.module";
import {EnvironmentDetailsModule} from "./environment-details/environment-details.module";
import {ModelDeploymentDetailsModule} from "./model-deployment-details/model-deployment-details.module";


@NgModule({
    declarations: [DeploymentManagementEditComponent],
    imports: [
        CommonModule,
        CardModule,
        InputTextModule,
        TranslateModule,
        ReactiveFormsModule,
        TimelineModule,
        ButtonModule,
        RippleModule,
        StepperModule,
        DeploymentManagementEditRoutingModule,
        StepperModule,
        EnvironmentDetailsModule,
        ModelDeploymentDetailsModule
    ]
})
export class DeploymentManagementEditModule { }
