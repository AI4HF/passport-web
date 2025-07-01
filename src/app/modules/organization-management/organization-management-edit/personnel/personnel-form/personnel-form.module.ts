import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelFormComponent } from './personnel-form.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TranslateModule } from '@ngx-translate/core';
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {ConnectorSecretModule} from "../connector-secret/connector-secret.module";

@NgModule({
    declarations: [PersonnelFormComponent],
    exports: [
        PersonnelFormComponent
    ],
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TranslateModule,
        DropdownModule,
        CheckboxModule,
        ConnectorSecretModule
    ]
})
export class PersonnelFormModule { }
