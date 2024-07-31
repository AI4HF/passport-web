import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CreationStepAssignmentTableComponent } from './creation-step-assignment-table.component';
import { CreationStepAssignmentFormModule } from '../creation-step-assignment-form/creation-step-assignment-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [CreationStepAssignmentTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        CreationStepAssignmentFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule,
        FormsModule,
        DropdownModule
    ],
    exports: [CreationStepAssignmentTableComponent]
})
export class CreationStepAssignmentTableModule { }