import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationStepAssignmentTableComponent } from './creation-step-assignment-table/creation-step-assignment-table.component';

const routes: Routes = [
    {
        path: '',
        component: CreationStepAssignmentTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreationStepAssignmentRoutingModule { }