import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpManagementDashboardComponent } from './lp-management-dashboard/lp-management-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: LpManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./lp-management-edit/lp-management-edit.module')
                    .then(m => m.LpManagementEditModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LpManagementRoutingModule {
    public static readonly route = 'learning-process-management';
}