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
import { StepperModule } from "../../../../shared/components/stepper/stepper.module";
import { FeatureSetDetailsModule } from "./featureset-details/featureset-details.module";
import { FeatureSetManagementEditRoutingModule } from "./featureset-management-edit-routing.module";
import { FeatureSetFeaturesModule } from "./featureset-features/featureset-features.module";

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
        StepperModule,
        FeatureSetDetailsModule,
        FeatureSetManagementEditRoutingModule,
        FeatureSetFeaturesModule
    ]
})
export class FeatureSetManagementEditModule { }
