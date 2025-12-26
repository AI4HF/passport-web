import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { LearningDatasetCreationTableComponent } from './learning-dataset-creation-table.component';
import { LearningDatasetCreationFormModule } from '../learning-dataset-creation-form/learning-dataset-creation-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";
import {
    CascadeValidationDialogModule
} from "../../../../../shared/components/cascade-validation-dialog/cascade-validation-dialog.module";

@NgModule({
    declarations: [LearningDatasetCreationTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        LearningDatasetCreationFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule,
        CascadeValidationDialogModule
    ],
    exports: [LearningDatasetCreationTableComponent]
})
export class LearningDatasetCreationTableModule { }