import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessDatasetAndStageAssignmentRoutingModule } from './learning-process-dataset-and-stage-assignment-routing.module';
import {
    LearningProcessDatasetAssignmentModule
} from "./learning-process-dataset-assignment/learning-process-dataset-assignment.module";
import {LearningStageCreationModule} from "./learning-stage-creation/learning-stage-creation.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningProcessDatasetAndStageAssignmentRoutingModule,
        LearningProcessDatasetAssignmentModule,
        LearningStageCreationModule
    ]
})
export class LearningProcessDatasetAndStageAssignmentModule { }