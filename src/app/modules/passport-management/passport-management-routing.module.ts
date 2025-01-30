import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PassportManagementTableComponent} from "./passport-management-table/passport-management-table.component";
import {AuditLogTableComponent} from "./audit-log-table/audit-log-table.component";

const routes: Routes = [
    { path: '', component: PassportManagementTableComponent },
    { path: 'audit-logs/:passportId', component: AuditLogTableComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PassportManagementRoutingModule { }
