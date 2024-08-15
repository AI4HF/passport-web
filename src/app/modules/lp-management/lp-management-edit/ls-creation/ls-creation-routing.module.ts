import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LsCreationTableComponent } from './ls-creation-table/ls-creation-table.component';
import { LsParameterTableComponent } from './ls-parameter/ls-parameter-table/ls-parameter-table.component';

const routes: Routes = [
    {
        path: '',
        component: LsCreationTableComponent
    },
    {
        path: ':learningStageId/learning-stage-parameter-assignment',
        component: LsParameterTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LsCreationRoutingModule { }
