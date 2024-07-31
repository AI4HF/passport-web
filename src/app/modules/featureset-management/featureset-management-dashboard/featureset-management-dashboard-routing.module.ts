import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FeatureSetManagementDashboardComponent} from "./featureset-management-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: FeatureSetManagementDashboardComponent
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeatureSetManagementDashboardRoutingModule {
}
