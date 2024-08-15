import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpParameterTableComponent } from './lp-parameter-table/lp-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: LpParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LpParameterRoutingModule { }
