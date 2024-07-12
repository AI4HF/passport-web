import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetDetailsComponent } from './dataset-details.component';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { CardModule } from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [DatasetDetailsComponent],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        CardModule,
        CheckboxModule,
        DropdownModule
    ]
})
export class DatasetDetailsModule { }
