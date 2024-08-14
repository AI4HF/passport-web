import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LearningStageParameterAssignmentFormComponent } from './learning-stage-parameter-assignment-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [LearningStageParameterAssignmentFormComponent],
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
    exports: [LearningStageParameterAssignmentFormComponent]
})
export class LearningStageParameterAssignmentFormModule { }