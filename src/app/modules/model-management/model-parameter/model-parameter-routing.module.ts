import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelParameterTableComponent } from './model-parameter-table/model-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: ModelParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelParameterRoutingModule { }
