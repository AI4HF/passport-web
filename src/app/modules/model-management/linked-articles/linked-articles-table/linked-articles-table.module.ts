import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LinkedArticlesTableComponent } from './linked-articles-table.component';
import { LinkedArticlesFormModule } from '../linked-articles-form/linked-articles-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [LinkedArticlesTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LinkedArticlesFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule
    ],
    exports: [LinkedArticlesTableComponent]
})
export class LinkedArticlesTableModule { }
