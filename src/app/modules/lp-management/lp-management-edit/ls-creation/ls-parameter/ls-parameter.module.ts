import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsParameterTableModule } from './ls-parameter-table/ls-parameter-table.module';
import { LsParameterFormModule } from './ls-parameter-form/ls-parameter-form.module';
import { LsParameterRoutingModule } from './ls-parameter-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LsParameterRoutingModule,
        LsParameterTableModule,
        LsParameterFormModule
    ]
})
export class LsParameterModule { }