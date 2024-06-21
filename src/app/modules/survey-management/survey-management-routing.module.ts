import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyManagementTableComponent } from './survey-management-table/survey-management-table.component';
import { SurveyManagementFormComponent } from './survey-management-form/survey-management-form.component';

const routes: Routes = [
    { path: '', component: SurveyManagementTableComponent },
    { path: 'form/new', component: SurveyManagementFormComponent },
    { path: 'form/:id', component: SurveyManagementFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SurveyManagementRoutingModule { }
