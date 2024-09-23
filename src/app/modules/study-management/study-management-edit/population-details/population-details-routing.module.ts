import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopulationDetailsTableComponent } from './population-details-table/population-details-table.component';

const routes: Routes = [
    {
        path: '',
        component: PopulationDetailsTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PopulationDetailsRoutingModule { }
