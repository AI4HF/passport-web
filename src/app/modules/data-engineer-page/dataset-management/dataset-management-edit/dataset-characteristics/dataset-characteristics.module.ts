import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetCharacteristicsTableModule } from './dataset-characteristics-table/dataset-characteristics-table.module';
import { DatasetCharacteristicsFormModule } from './dataset-characteristics-form/dataset-characteristics-form.module';
import { DatasetCharacteristicsRoutingModule } from './dataset-characteristics-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DatasetCharacteristicsRoutingModule,
        DatasetCharacteristicsTableModule,
        DatasetCharacteristicsFormModule
    ]
})
export class DatasetCharacteristicsModule { }