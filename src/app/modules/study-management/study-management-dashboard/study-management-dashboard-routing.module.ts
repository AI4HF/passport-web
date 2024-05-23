import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudyManagementDashboardComponent} from "./study-management-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: StudyManagementDashboardComponent
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudyManagementDashboardRoutingModule {
}
