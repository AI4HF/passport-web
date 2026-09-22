import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelManagementTableComponent } from './model-management-table/model-management-table.component';
import { ModelParameterTableComponent } from './model-parameter/model-parameter-table/model-parameter-table.component';
import {
    ModelEvaluationTableComponent
} from "./model-evaluation/model-evaluation-table/model-evaluation-table.component";
import {
    LinkedArticlesTableComponent
} from "./linked-articles/linked-articles-table/linked-articles-table.component";
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
        path: ':modelId/model-evaluation',
        component: ModelEvaluationTableComponent
    },
    {
        path: ':modelId/linked-article',
        component: LinkedArticlesTableComponent
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