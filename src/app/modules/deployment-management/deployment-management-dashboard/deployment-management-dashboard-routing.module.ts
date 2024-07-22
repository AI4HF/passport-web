import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DeploymentManagementDashboardComponent} from "./deployment-management-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: DeploymentManagementDashboardComponent
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeploymentManagementDashboardRoutingModule {
}
