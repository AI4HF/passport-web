import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudyDetailsComponent} from "./study-details.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {TooltipComponent} from "../../../../layout/app.tooltip.component";
import {DockModule} from "primeng/dock";



@NgModule({
    declarations: [StudyDetailsComponent, TooltipComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    RippleModule,
    TranslateModule,
    DockModule
  ],
  exports: [StudyDetailsComponent, TooltipComponent]
})
export class StudyDetailsModule { }
