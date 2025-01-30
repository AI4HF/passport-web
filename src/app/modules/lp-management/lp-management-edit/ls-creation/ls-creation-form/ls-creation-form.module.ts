import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LsCreationFormComponent } from './ls-creation-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {
    StudyDetailsModule
} from "../../../../study-management/study-management-edit/study-details/study-details.module";
import {AutoCompleteModule} from "primeng/autocomplete";

@NgModule({
    declarations: [LsCreationFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        DropdownModule,
        StudyDetailsModule,
        AutoCompleteModule
    ],
    exports: [LsCreationFormComponent]
})
export class LsCreationFormModule { }