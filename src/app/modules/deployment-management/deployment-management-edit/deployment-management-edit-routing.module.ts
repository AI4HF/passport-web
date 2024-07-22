import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {EnvironmentDetailsComponent} from "./environment-details/environment-details.component";
import {ModelDeploymentDetailsComponent} from "./model-deployment-details/model-deployment-details.component";
import {environmentDetailsGuard} from "../../../core/guards/environment-details.guard";
import {DeploymentManagementEditComponent} from "./deployment-management-edit.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'environment-details',
                pathMatch: 'full' // match the full url to avoid infinite redirection
            },
            {
                path: 'environment-details',
                component: EnvironmentDetailsComponent,
            },
            {
                path: 'model-deployment-details',
                component: ModelDeploymentDetailsComponent,
                canActivate: [environmentDetailsGuard]
            }
        ],
        component: DeploymentManagementEditComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeploymentManagementEditRoutingModule {
}
