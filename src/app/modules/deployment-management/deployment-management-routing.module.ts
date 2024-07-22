import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DeploymentManagementDashboardComponent} from "./deployment-management-dashboard/deployment-management-dashboard.component";
import {DeploymentManagementResolver} from "../../core/resolvers/deployment-management.resolver";


const routes: Routes = [
    {
        path: '',
        component: DeploymentManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./deployment-management-edit/deployment-management-edit.module')
                    .then(m => m.DeploymentManagementEditModule)
            }
        ],
        resolve: {deployment: DeploymentManagementResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeploymentManagementRoutingModule {
    public static readonly route = 'deployment-management';
}
