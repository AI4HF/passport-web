import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LsParameterTableComponent } from './ls-parameter-table/ls-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: LsParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LsParameterRoutingModule { }