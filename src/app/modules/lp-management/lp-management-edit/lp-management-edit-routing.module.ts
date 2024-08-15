import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpManagementEditComponent } from './lp-management-edit.component';
import { LpDatasetTableComponent } from './lp-dataset/lp-dataset-table/lp-dataset-table.component';
import {
    LpDetailsComponent
} from "./lp-details/lp-details.component";
import {
    LpParameterTableComponent
} from "./lp-parameter/lp-parameter-table/lp-parameter-table.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'learning-process-and-implementation-details',
                pathMatch: 'full'
            },
            {
                path: 'learning-process-and-implementation-details',
                component: LpDetailsComponent,
            },
            {
                path: 'learning-process-dataset-assignment',
                component: LpDatasetTableComponent
            },
            {
                path: 'learning-stage-management',
                loadChildren: () => import('./ls-creation/ls-creation.module').then(m => m.LsCreationModule)
            },
            {
                path: 'learning-process-parameter-assignment',
                component: LpParameterTableComponent
            }
        ],
        component: LpManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LpManagementEditRoutingModule {}
