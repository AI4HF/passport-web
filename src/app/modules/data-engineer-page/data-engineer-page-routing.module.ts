import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'dataset-management',
        loadChildren: () => import('./dataset-management/dataset-management.module').then(m => m.DatasetManagementModule)
    },
    {
        path: 'featureset-management',
        loadChildren: () => import('./featureset-management/featureset-management.module').then(m => m.FeatureSetManagementModule)
    },
    {
        path: '',
        redirectTo: 'featureset-management',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataEngineerPageRoutingModule { }

