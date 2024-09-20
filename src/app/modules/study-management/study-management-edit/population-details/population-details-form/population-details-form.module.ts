import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PopulationDetailsFormComponent } from './population-details-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {StudyDetailsModule} from "../../study-details/study-details.module";

@NgModule({
    declarations: [PopulationDetailsFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        StudyDetailsModule
    ],
    exports: [PopulationDetailsFormComponent]
})
export class PopulationDetailsFormModule { }
