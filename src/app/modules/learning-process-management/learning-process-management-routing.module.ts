import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningProcessManagementDashboardComponent } from './learning-process-management-dashboard/learning-process-management-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: LearningProcessManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./learning-process-management-edit/learning-process-management-edit.module')
                    .then(m => m.LearningProcessManagementEditModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningProcessManagementRoutingModule {
    public static readonly route = 'learning-process-management';
}