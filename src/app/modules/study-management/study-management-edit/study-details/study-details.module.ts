import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudyDetailsComponent} from "./study-details.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [StudyDetailsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    RippleModule,
    TranslateModule
  ],
  exports: [StudyDetailsComponent]
})
export class StudyDetailsModule { }
