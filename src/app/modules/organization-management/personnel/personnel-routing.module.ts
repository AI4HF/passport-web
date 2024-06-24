import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonnelTableComponent } from './personnel-table/personnel-table.component';
import { PersonnelFormComponent } from './personnel-form/personnel-form.component';

const routes: Routes = [
    { path: 'table', component: PersonnelTableComponent },
    { path: 'form/new', component: PersonnelFormComponent },
    { path: 'form/:id', component: PersonnelFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonnelRoutingModule { }
