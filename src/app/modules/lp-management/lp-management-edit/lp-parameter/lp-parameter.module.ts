import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpParameterTableModule } from './lp-parameter-table/lp-parameter-table.module';
import { LpParameterFormModule } from './lp-parameter-form/lp-parameter-form.module';
import { LpParameterRoutingModule } from './lp-parameter-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LpParameterRoutingModule,
        LpParameterTableModule,
        LpParameterFormModule
    ]
})
export class LpParameterModule { }
