import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from "@ngx-translate/core";
import { ModelEvaluationFormComponent } from './model-evaluation-form.component';

@NgModule({
    declarations: [ModelEvaluationFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        ButtonModule,
        TranslateModule
    ],
    exports: [ModelEvaluationFormComponent]
})
export class ModelEvaluationFormModule { }
