import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { FeatureSetDetailsComponent } from "./featureset-details/featureset-details.component";
import { FeatureSetManagementEditComponent } from "./featureset-management-edit.component";
import { FeatureSetFeaturesTableComponent } from "./featureset-features/featureset-features-table/featureset-features-table.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'featureset-details',
                pathMatch: 'full'
            },
            {
                path: 'featureset-details',
                component: FeatureSetDetailsComponent,
            },
            {
                path: 'featureset-features',
                component: FeatureSetFeaturesTableComponent,
            }
        ],
        component: FeatureSetManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeatureSetManagementEditRoutingModule { }
