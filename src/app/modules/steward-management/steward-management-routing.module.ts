import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StewardManagementComponent } from './steward-management.component';

const routes: Routes = [
    { path: '', component: StewardManagementComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StewardManagementRoutingModule { }
