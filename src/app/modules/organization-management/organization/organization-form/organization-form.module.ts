import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationFormComponent } from './organization-form.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [OrganizationFormComponent],
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TranslateModule
    ]
})
export class OrganizationFormModule { }
