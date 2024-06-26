import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonnelTableComponent } from './personnel-table/personnel-table.component';

const routes: Routes = [
    { path: 'table', component: PersonnelTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonnelRoutingModule { }
