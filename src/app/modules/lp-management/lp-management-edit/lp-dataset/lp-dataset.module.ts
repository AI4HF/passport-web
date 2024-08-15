import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpDatasetTableModule } from './lp-dataset-table/lp-dataset-table.module';
import { LpDatasetFormModule } from './lp-dataset-form/lp-dataset-form.module';
import { LpDatasetRoutingModule } from './lp-dataset-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LpDatasetRoutingModule,
        LpDatasetTableModule,
        LpDatasetFormModule
    ]
})
export class LpDatasetModule { }