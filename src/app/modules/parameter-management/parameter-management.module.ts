import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParameterManagementTableModule} from "./parameter-management-table/parameter-management-table.module";
import {ParameterManagementFormModule} from "./parameter-management-form/parameter-management-form.module";
import {ParameterManagementRoutingModule} from "./parameter-management-routing.module";



@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      ParameterManagementRoutingModule,
      ParameterManagementTableModule,
      ParameterManagementFormModule
  ]
})
export class ParameterManagementModule { }
