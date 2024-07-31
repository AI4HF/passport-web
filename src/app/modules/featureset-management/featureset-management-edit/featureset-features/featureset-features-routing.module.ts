import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureSetFeaturesTableComponent } from './featureset-features-table/featureset-features-table.component';

const routes: Routes = [
    {
        path: '',
        component: FeatureSetFeaturesTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureSetFeaturesRoutingModule { }
