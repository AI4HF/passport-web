import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {PassportManagementTableComponent} from "./passport-management-table.component";
import {PassportManagementFormModule} from "../passport-management-form/passport-management-form.module";
import {CardModule} from "primeng/card";
import {DialogModule} from "primeng/dialog";



@NgModule({
    declarations: [PassportManagementTableComponent],
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SharedModule,
        TableModule,
        TooltipModule,
        TranslateModule,
        PassportManagementFormModule,
        CardModule,
        DialogModule
    ],
    exports: [PassportManagementTableComponent]
})
export class PassportManagementTableModule { }
