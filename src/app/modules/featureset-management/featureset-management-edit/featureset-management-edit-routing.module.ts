import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { FeatureSetManagementEditComponent } from "./featureset-management-edit.component";

const routes: Routes = [
    {
        path: '',
        component: FeatureSetManagementEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeatureSetManagementEditRoutingModule { }
