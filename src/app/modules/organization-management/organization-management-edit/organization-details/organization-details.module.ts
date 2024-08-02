import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrganizationDetailsComponent} from "./organization-details.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [OrganizationDetailsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RippleModule,
    SharedModule,
    TranslateModule
  ],
  exports: [OrganizationDetailsComponent]
})
export class OrganizationDetailsModule { }
