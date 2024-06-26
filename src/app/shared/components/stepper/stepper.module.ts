import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StepperComponent} from "./stepper.component";
import {CardModule} from "primeng/card";
import {SharedModule} from "primeng/api";
import {TimelineModule} from "primeng/timeline";



@NgModule({
  declarations: [StepperComponent],
  imports: [
    CommonModule,
    CardModule,
    SharedModule,
    TimelineModule
  ],
  exports: [StepperComponent]
})
export class StepperModule { }
