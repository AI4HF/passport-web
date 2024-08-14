import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessDatasetAssignmentTableModule } from './learning-process-dataset-assignment-table/learning-process-dataset-assignment-table.module';
import { LearningProcessDatasetAssignmentFormModule } from './learning-process-dataset-assignment-form/learning-process-dataset-assignment-form.module';
import { LearningProcessDatasetAssignmentRoutingModule } from './learning-process-dataset-assignment-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningProcessDatasetAssignmentRoutingModule,
        LearningProcessDatasetAssignmentTableModule,
        LearningProcessDatasetAssignmentFormModule
    ]
})
export class LearningProcessDatasetAssignmentModule { }