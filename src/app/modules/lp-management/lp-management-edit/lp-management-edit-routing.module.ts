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
import {LpGuard} from "../../../core/guards/lp.guard";

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
                component: LpDetailsComponent
            },
            {
                path: 'learning-process-dataset-assignment',
                component: LpDatasetTableComponent,
                canActivate: [LpGuard]
            },
            {
                path: 'learning-stage-management',
                loadChildren: () => import('./ls-creation/ls-creation.module').then(m => m.LsCreationModule),
                canActivate: [LpGuard]
            },
            {
                path: 'learning-process-parameter-assignment',
                component: LpParameterTableComponent,
                canActivate: [LpGuard]
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
