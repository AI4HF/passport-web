import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelManagementTableComponent } from './model-management-table/model-management-table.component';
import { ModelParameterTableComponent } from './model-parameter/model-parameter-table/model-parameter-table.component';
import {
    EvaluationMeasureTableComponent
} from "./evaluation-measure/evaluation-measure-table/evaluation-measure-table.component";
import {ModelFigureGalleryComponent} from "./model-figure-gallery/model-figure-gallery.component";

const routes: Routes = [
    {
        path: '',
        component: ModelManagementTableComponent
    },
    {
        path: ':modelId/model-parameter-assignment',
        component: ModelParameterTableComponent
    },
    {
        path: ':modelId/evaluation-measure-assignment',
        component: EvaluationMeasureTableComponent
    },
    {
        path: ':modelId/model-figure-gallery',
        component: ModelFigureGalleryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelManagementRoutingModule { }