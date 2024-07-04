import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationTableComponent } from './organization-table.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {DockModule} from "primeng/dock";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogModule} from "primeng/dialog";
import {OrganizationFormModule} from "../organization-form/organization-form.module";

@NgModule({
    declarations: [OrganizationTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TranslateModule,
        FormsModule,
        RippleModule,
        DockModule,
        InputTextareaModule,
        DialogModule,
        OrganizationFormModule
    ]
})
export class OrganizationTableModule { }
