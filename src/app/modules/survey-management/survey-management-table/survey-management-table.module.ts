import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { SurveyManagementTableComponent } from './survey-management-table.component';
import { RouterModule } from '@angular/router';
import {ChipsModule} from "primeng/chips";
import {DockModule} from "primeng/dock";

@NgModule({
    declarations: [SurveyManagementTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        FormsModule,
        RouterModule,
        ChipsModule,
        DockModule
    ],
    exports: [SurveyManagementTableComponent]
})
export class SurveyManagementTableModule { }
