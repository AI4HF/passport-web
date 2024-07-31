import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureSetFeaturesTableModule } from './featureset-features-table/featureset-features-table.module';
import { FeatureSetFeaturesFormModule } from './featureset-features-form/featureset-features-form.module';
import { FeatureSetFeaturesRoutingModule } from './featureset-features-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FeatureSetFeaturesRoutingModule,
        FeatureSetFeaturesTableModule,
        FeatureSetFeaturesFormModule
    ]
})
export class FeatureSetFeaturesModule { }
