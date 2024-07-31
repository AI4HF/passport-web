import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureSetManagementEditComponent } from "./featureset-management-edit.component";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TimelineModule } from "primeng/timeline";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { FeatureSetDetailsModule } from "./featureset-details/featureset-details.module";
import { FeatureSetManagementEditRoutingModule } from "./featureset-management-edit-routing.module";
import { FeatureSetFeaturesModule } from "./featureset-features/featureset-features.module";
import {
    FeatureSetFeaturesTableModule
} from "./featureset-features/featureset-features-table/featureset-features-table.module";

@NgModule({
    declarations: [FeatureSetManagementEditComponent],
    imports: [
        CommonModule,
        CardModule,
        InputTextModule,
        TranslateModule,
        ReactiveFormsModule,
        TimelineModule,
        ButtonModule,
        RippleModule,
        FeatureSetDetailsModule,
        FeatureSetManagementEditRoutingModule,
        FeatureSetFeaturesModule,
        FeatureSetFeaturesTableModule
    ]
})
export class FeatureSetManagementEditModule { }
