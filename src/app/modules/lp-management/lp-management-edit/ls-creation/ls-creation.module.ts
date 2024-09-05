import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsCreationTableModule } from './ls-creation-table/ls-creation-table.module';
import { LsCreationFormModule } from './ls-creation-form/ls-creation-form.module';
import { LsCreationRoutingModule } from './ls-creation-routing.module';
import {
    LsParameterModule
} from "./ls-parameter/ls-parameter.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LsCreationRoutingModule,
        LsCreationTableModule,
        LsCreationFormModule,
        LsParameterModule
    ]
})
export class LsCreationModule { }