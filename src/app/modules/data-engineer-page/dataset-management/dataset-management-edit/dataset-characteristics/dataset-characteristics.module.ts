import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetCharacteristicsComponent } from './dataset-characteristics.component';
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { CardModule } from "primeng/card";

@NgModule({
    declarations: [DatasetCharacteristicsComponent],
    imports: [
        CommonModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        CardModule
    ]
})
export class DatasetCharacteristicsModule { }
