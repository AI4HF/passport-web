import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelManagementRoutingModule} from "./model-management-routing.module";
import {ModelManagementTableModule} from "./model-management-table/model-management-table.module";
import {ModelManagementFormModule} from "./model-management-form/model-management-form.module";
import {ModelParameterModule} from "./model-parameter/model-parameter.module";
import {EvaluationMeasureModule} from "./evaluation-measure/evaluation-measure.module";
import {ModelFigureGalleryModule} from "./model-figure-gallery/model-figure-gallery.module";



@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      ModelManagementRoutingModule,
      ModelManagementTableModule,
      ModelManagementFormModule,
      ModelParameterModule,
      EvaluationMeasureModule,
      ModelFigureGalleryModule
  ]
})
export class ModelManagementModule { }
