import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpManagementEditComponent } from "./lp-management-edit.component";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TimelineModule } from "primeng/timeline";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { StepperModule } from "../../../shared/components/stepper/stepper.module";
import { LpDetailsModule } from "./lp-details/lp-details.module";
import { LpManagementEditRoutingModule } from "./lp-management-edit-routing.module";
import {LpParameterModule} from "./lp-parameter/lp-parameter.module";
import {LsCreationModule} from "./ls-creation/ls-creation.module";
import {
    LpDatasetModule
} from "./lp-dataset/lp-dataset.module";

@NgModule({
    declarations: [LpManagementEditComponent],
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
        LpDetailsModule,
        LpManagementEditRoutingModule,
        LpDatasetModule,
        LsCreationModule,
        LpParameterModule
    ]
})
export class LpManagementEditModule { }
