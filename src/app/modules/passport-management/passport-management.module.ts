import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PassportManagementTableModule} from "./passport-management-table/passport-management-table.module";
import {PassportManagementRoutingModule} from "./passport-management-routing.module";
import {PassportManagementFormModule} from "./passport-management-form/passport-management-form.module";
import {PassportPdfExportModule} from "./passport-pdf-export/passport-pdf-export.module";
import {AuditLogTableModule} from "./audit-log-table/audit-log-table.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PassportManagementRoutingModule,
        PassportManagementTableModule,
        PassportManagementFormModule,
        PassportPdfExportModule,
        AuditLogTableModule
    ]
})
export class PassportManagementModule { }
