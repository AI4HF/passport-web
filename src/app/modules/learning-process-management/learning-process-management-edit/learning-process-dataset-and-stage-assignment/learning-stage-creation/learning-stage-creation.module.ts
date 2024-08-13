import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningStageCreationTableModule } from './learning-stage-creation-table/learning-stage-creation-table.module';
import { LearningStageCreationFormModule } from './learning-stage-creation-form/learning-stage-creation-form.module';
import { LearningStageCreationRoutingModule } from './learning-stage-creation-routing.module';
import {
    LearningStageParameterAssignmentModule
} from "./learning-stage-parameter-assignment/learning-stage-parameter-assignment.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningStageCreationRoutingModule,
        LearningStageCreationTableModule,
        LearningStageCreationFormModule,
        LearningStageParameterAssignmentModule
    ]
})
export class LearningStageCreationModule { }