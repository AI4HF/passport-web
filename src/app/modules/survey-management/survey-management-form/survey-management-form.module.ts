import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SurveyManagementFormComponent } from './survey-management-form.component';
import { RouterModule } from '@angular/router';
import {ChipsModule} from "primeng/chips";
import {InputTextareaModule} from "primeng/inputtextarea";
import {AutoCompleteModule} from "primeng/autocomplete";

@NgModule({
    declarations: [SurveyManagementFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        DialogModule,
        ButtonModule,
        RouterModule,
        ChipsModule,
        InputTextareaModule,
        AutoCompleteModule
    ],
    exports: [SurveyManagementFormComponent]
})
export class SurveyManagementFormModule { }
