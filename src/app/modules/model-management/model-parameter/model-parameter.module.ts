import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelParameterTableModule } from './model-parameter-table/model-parameter-table.module';
import { ModelParameterFormModule } from './model-parameter-form/model-parameter-form.module';
import { ModelParameterRoutingModule } from './model-parameter-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ModelParameterRoutingModule,
        ModelParameterTableModule,
        ModelParameterFormModule
    ]
})
export class ModelParameterModule { }
