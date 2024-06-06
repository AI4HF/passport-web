import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization-main/organization.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { OrganizationManagementComponent } from './organization-management.component';
import { OrganizationManagementRoutingModule } from './organization-management-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {ChipModule} from "primeng/chip";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [
        OrganizationComponent,
        PersonnelComponent,
        OrganizationManagementComponent
    ],
    imports: [
        CommonModule,
        OrganizationManagementRoutingModule,
        TabMenuModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        FormsModule,
        TableModule,
        RippleModule,
        TranslateModule,
        ChipModule,
        InputTextareaModule,
        DropdownModule
    ]
})
export class OrganizationManagementModule { }

