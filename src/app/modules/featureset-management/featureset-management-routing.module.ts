import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureSetManagementDashboardComponent } from './featureset-management-dashboard/featureset-management-dashboard.component';
import { FeatureSetResolver } from '../../core/resolvers/featureset-management.resolver';

const routes: Routes = [
    {
        path: '',
        component: FeatureSetManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./featureset-management-edit/featureset-management-edit.module')
                    .then(m => m.FeatureSetManagementEditModule)
            }
        ],
        resolve: {featureSet: FeatureSetResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureSetManagementRoutingModule {
    public static readonly route = 'featureset-management';
}

