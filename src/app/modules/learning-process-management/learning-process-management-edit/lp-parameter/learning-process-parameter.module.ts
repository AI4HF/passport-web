import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProcessParameterTableModule } from './learning-process-parameter-table/learning-process-parameter-table.module';
import { LearningProcessParameterFormModule } from './lp-parameter-form/learning-process-parameter-form.module';
import { LearningProcessParameterRoutingModule } from './learning-process-parameter-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LearningProcessParameterRoutingModule,
        LearningProcessParameterTableModule,
        LearningProcessParameterFormModule
    ]
})
export class LearningProcessParameterModule { }
