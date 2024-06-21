import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyManagementRoutingModule } from './survey-management-routing.module';
import { SurveyManagementTableModule } from './survey-management-table/survey-management-table.module';
import { SurveyManagementFormModule } from './survey-management-form/survey-management-form.module';

@NgModule({
    imports: [
        CommonModule,
        SurveyManagementRoutingModule,
        SurveyManagementTableModule,
        SurveyManagementFormModule
    ]
})
export class SurveyManagementModule { }

