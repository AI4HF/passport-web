import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelManagementRoutingModule} from "./model-management-routing.module";
import {ModelManagementTableModule} from "./model-management-table/model-management-table.module";
import {ModelManagementFormModule} from "./model-management-form/model-management-form.module";
import {ModelParameterModule} from "./model-parameter/model-parameter.module";
import {ModelEvaluationModule} from "./model-evaluation/model-evaluation.module";
import {LinkedArticlesModule} from "./linked-articles/linked-articles.module";
import {ModelFigureGalleryModule} from "./model-figure-gallery/model-figure-gallery.module";



@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      ModelManagementRoutingModule,
      ModelManagementTableModule,
      ModelManagementFormModule,
      ModelParameterModule,
      ModelEvaluationModule,
      LinkedArticlesModule,
      ModelFigureGalleryModule
  ]
})
export class ModelManagementModule { }
