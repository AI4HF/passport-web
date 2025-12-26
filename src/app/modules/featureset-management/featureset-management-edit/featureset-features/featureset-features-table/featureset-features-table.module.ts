import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FeatureSetFeaturesTableComponent } from './featureset-features-table.component';
import { FeatureSetFeaturesFormModule } from '../featureset-features-form/featureset-features-form.module';
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {CheckboxModule} from "primeng/checkbox";
import {
    CascadeValidationDialogModule
} from "../../../../../shared/components/cascade-validation-dialog/cascade-validation-dialog.module";

@NgModule({
    declarations: [FeatureSetFeaturesTableComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        CardModule,
        DialogModule,
        FeatureSetFeaturesFormModule,
        TranslateModule,
        RippleModule,
        ChipsModule,
        CheckboxModule,
        CascadeValidationDialogModule
    ],
    exports: [FeatureSetFeaturesTableComponent]
})
export class FeatureSetFeaturesTableModule { }
