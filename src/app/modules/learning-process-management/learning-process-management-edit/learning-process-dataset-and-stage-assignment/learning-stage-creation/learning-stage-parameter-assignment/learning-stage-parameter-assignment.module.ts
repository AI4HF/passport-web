import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningStageParameterAssignmentTableModule } from './learning-stage-parameter-assignment-table/learning-stage-parameter-assignment-table.module';
import { LearningStageParameterAssignmentFormModule } from './learning-stage-parameter-assignment-form/learning-stage-parameter-assignment-form.module';
import { LearningStageParameterAssignmentRoutingModule } from './learning-stage-parameter-assignment-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningStageParameterAssignmentRoutingModule,
        LearningStageParameterAssignmentTableModule,
        LearningStageParameterAssignmentFormModule
    ]
})
export class LearningStageParameterAssignmentModule { }