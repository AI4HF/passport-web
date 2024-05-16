import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormInputComponent} from './components/form-input/form-input.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  declarations: [
    FormInputComponent,
    TooltipComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    InputTextModule
  ],
  exports: [
    FormInputComponent,
    TooltipComponent,
    CardModule,
    ButtonModule
  ]
})
export class SharedModule { }
