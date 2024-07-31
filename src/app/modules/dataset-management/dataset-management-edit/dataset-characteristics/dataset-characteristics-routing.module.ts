import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetCharacteristicsTableComponent } from './dataset-characteristics-table/dataset-characteristics-table.component';

const routes: Routes = [
    {
        path: '',
        component: DatasetCharacteristicsTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetCharacteristicsRoutingModule { }