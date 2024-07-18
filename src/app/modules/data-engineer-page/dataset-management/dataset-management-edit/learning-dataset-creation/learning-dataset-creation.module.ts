import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningDatasetCreationTableModule } from './learning-dataset-creation-table/learning-dataset-creation-table.module';
import { LearningDatasetCreationFormModule } from './learning-dataset-creation-form/learning-dataset-creation-form.module';
import { LearningDatasetCreationRoutingModule } from './learning-dataset-creation-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningDatasetCreationRoutingModule,
        LearningDatasetCreationTableModule,
        LearningDatasetCreationFormModule
    ]
})
export class LearningDatasetCreationModule { }