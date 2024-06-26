import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyManagementTableComponent } from './survey-management-table/survey-management-table.component';

const routes: Routes = [
    { path: '', component: SurveyManagementTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SurveyManagementRoutingModule { }
