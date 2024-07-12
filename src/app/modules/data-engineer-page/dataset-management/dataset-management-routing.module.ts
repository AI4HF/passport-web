import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetManagementDashboardComponent } from './dataset-management-dashboard/dataset-management-dashboard.component';
import {DatasetResolver} from "../../../core/resolvers/dataset-management.resolver";

const routes: Routes = [
    {
        path: '',
        component: DatasetManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./dataset-management-edit/dataset-management-edit.module')
                    .then(m => m.DatasetManagementEditModule)
            }
        ],
        resolve: {dataset: DatasetResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetManagementRoutingModule {
    public static readonly route = 'data-engineer-page/dataset-management';
}
