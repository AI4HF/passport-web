import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessManagementEditComponent } from "./learning-process-management-edit.component";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TimelineModule } from "primeng/timeline";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { StepperModule } from "../../../shared/components/stepper/stepper.module";
import { LearningProcessAndImplementationDetailsModule } from "./learning-process-and-implementation-details/learning-process-and-implementation-details.module";
import { LearningProcessManagementEditRoutingModule } from "./learning-process-management-edit-routing.module";
import { LearningProcessDatasetAndStageAssignmentModule } from "./learning-process-dataset-and-stage-assignment/learning-process-dataset-and-stage-assignment.module";
import {LearningProcessParameterModule} from "./lp-parameter/learning-process-parameter.module";

@NgModule({
    declarations: [LearningProcessManagementEditComponent],
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
        LearningProcessAndImplementationDetailsModule,
        LearningProcessManagementEditRoutingModule,
        LearningProcessDatasetAndStageAssignmentModule,
        LearningProcessParameterModule
    ]
})
export class LearningProcessManagementEditModule { }
