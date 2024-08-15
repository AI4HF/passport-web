import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LsParameterTableComponent } from './ls-parameter-table.component';
import { LsParameterFormModule } from '../ls-parameter-form/ls-parameter-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [LsParameterTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LsParameterFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule,
        ReactiveFormsModule,
        DropdownModule
    ],
    exports: [LsParameterTableComponent]
})
export class LsParameterTableModule { }