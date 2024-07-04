import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelTableModule } from './personnel-table/personnel-table.module';
import { PersonnelFormModule } from './personnel-form/personnel-form.module';
import {PersonnelRoutingModule} from "./personnel-routing.module";

@NgModule({
    imports: [
        CommonModule,
        PersonnelTableModule,
        PersonnelFormModule,
        PersonnelRoutingModule
    ]
})
export class PersonnelModule { }


