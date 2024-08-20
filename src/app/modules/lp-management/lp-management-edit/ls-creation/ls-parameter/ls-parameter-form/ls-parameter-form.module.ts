import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LsParameterFormComponent } from './ls-parameter-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [LsParameterFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        DropdownModule
    ],
    exports: [LsParameterFormComponent]
})
export class LsParameterFormModule { }