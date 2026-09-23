import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LinkedArticlesFormComponent } from './linked-articles-form.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [LinkedArticlesFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckboxModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        TranslateModule
    ],
    exports: [LinkedArticlesFormComponent]
})
export class LinkedArticlesFormModule { }
