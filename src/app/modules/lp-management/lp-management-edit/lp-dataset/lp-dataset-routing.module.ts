import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpDatasetTableComponent } from './lp-dataset-table/lp-dataset-table.component';

const routes: Routes = [
    {
        path: '',
        component: LpDatasetTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LpDatasetRoutingModule { }