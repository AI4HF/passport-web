import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopulationDetailsTableModule } from './population-details-table/population-details-table.module';
import { PopulationDetailsFormModule } from './population-details-form/population-details-form.module';
import { PopulationDetailsRoutingModule } from './population-details-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PopulationDetailsRoutingModule,
    PopulationDetailsTableModule,
    PopulationDetailsFormModule
  ]
})
export class PopulationDetailsModule { }
