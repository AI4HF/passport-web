import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetManagementEditComponent } from "./dataset-management-edit.component";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TimelineModule } from "primeng/timeline";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { StepperModule } from "../../../../shared/components/stepper/stepper.module";
import { DatasetDetailsModule } from "./dataset-details/dataset-details.module";
import { DatasetManagementEditRoutingModule } from "./dataset-management-edit-routing.module";
import { DatasetCharacteristicsModule } from "./dataset-characteristics/dataset-characteristics.module";
import { CreationStepAssignmentModule } from "./creation-step-assignment/creation-step-assignment.module";
import { LearningDatasetCreationModule } from "./learning-dataset-creation/learning-dataset-creation.module";

@NgModule({
    declarations: [DatasetManagementEditComponent],
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
        DatasetDetailsModule,
        DatasetManagementEditRoutingModule,
        DatasetCharacteristicsModule,
        CreationStepAssignmentModule,
        LearningDatasetCreationModule
    ]
})
export class DatasetManagementEditModule { }
