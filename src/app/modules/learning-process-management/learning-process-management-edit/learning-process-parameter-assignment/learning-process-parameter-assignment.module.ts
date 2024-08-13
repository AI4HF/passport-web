import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessParameterAssignmentTableModule } from './learning-process-parameter-assignment-table/learning-process-parameter-assignment-table.module';
import { LearningProcessParameterAssignmentFormModule } from './learning-process-parameter-assignment-form/learning-process-parameter-assignment-form.module';
import { LearningProcessParameterAssignmentRoutingModule } from './learning-process-parameter-assignment-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningProcessParameterAssignmentRoutingModule,
        LearningProcessParameterAssignmentTableModule,
        LearningProcessParameterAssignmentFormModule
    ]
})
export class LearningProcessParameterAssignmentModule { }
